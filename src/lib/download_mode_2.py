#############################################################################################
#                                        MODO 2
#
#                     id    texto    otro             cat_texto
#                      5    "hola"   0.5      "  <cat1>hola</cat1>  "
#                     --------------------    -----------------------
#                             ^                         ^
#                      DATOS ORIGINALES        CATEGORIAS ETIQUETADAS
#############################################################################################
import pandas as pd
import mysql.connector
from mysql.connector import Error
import sys
import json


def comparar_hash(hash, tipo):
    qry = "SELECT idDocument FROM documents WHERE hash =" + "'" + hash + "'" 
    idDocu = consultar_bd(qry) # traer el idDocument con el hash
    get_data(idDocu[0][0], tipo)


def get_data(idDocu, tipo):
    # obtener los taggeados que sean del documento solicitado
    qry = "SELECT tagged FROM DialogInterviews WHERE idDocument =" +  str(idDocu)
    tupla_tagged = consultar_bd(qry)
    
    # formatear tupla a un vector unidimencional
    lista_tagged = formatear_tupla(tupla_tagged)
    nueva_colum = lista_tagged.copy()
    nombre_arch = obtener_nombre_arch(idDocu) # obtener el nombre de archivo para guardado

    if (nombre_arch.endswith('json') and tipo == 'json'):
        #############################################################################
        # SOLO FUNCIONA CUANDO VIENE DE UN JSON Y SE DESCARGA COMO JSON
        ############################################################################
        # obtener el contenido de los textos originales
        qry = "SELECT content FROM DialogInterviews WHERE idDocument =" +  str(idDocu)
        tupla_textos = consultar_bd(qry)
        # obtener una lista de los textos
        lista_textos = formatear_tupla(tupla_textos)
        # unir en una lista dos listas:
        # la 1er contendra los textos NO tageados
        # la 2da contendra los textos taggeados
        lista_final = []
        lista_tageados = []
        lista_NO_taggeados = []
        for i in range(0,len(lista_tagged)):
            if lista_tagged[i] == 'not tagged':
                lista_NO_taggeados.append(lista_textos[i])
            else:
                lista_tageados.append(lista_tagged[i])
        # unir los no tagged con los tagged en una lista
        lista_final.append(lista_NO_taggeados)
        lista_final.append(lista_tageados)
        # convertir la lista en un diccionario
        cats_sin_repetir = ['NotTagged','Tagged']
        dictJSON = {cats_sin_repetir[i]: lista_final[i] for i in range(0, len(cats_sin_repetir))}
        # guardarlo
        with open('src/files/originalfiles/'+str(nombre_arch), encoding='utf-8') as f: # abrirlo con encoding utf-8
            data = json.load(f)   
            insert_to_json(data, dictJSON, nombre_arch) #juntar el diccionario con el json original
        
    else:       
        data = abrir_docu(nueva_colum, nombre_arch) # abrir el documento original y pegarle el vector
        nuevo_nombre = cambiar_tipo_arch(data, nombre_arch) #cambiar el nombre y tipo de documento
        print("src/files/taggedfiles/mode2/TAGGED_" + str(nuevo_nombre)) # pasarle a js la dir con el nombre

def formatear_tupla(tupla):
    lista = []
    for x in tupla:
        lista.append(x[0])
    return lista

def obtener_nombre_arch(idDocu):
    # obtiene el nombre por el id del archivo
    qry = "SELECT name FROM documents WHERE idDocument =" + str(idDocu)
    nombre = consultar_bd(qry)
    return(nombre[0][0])


def abrir_docu(nueva_colum, nombre_arch):
    # abrir el docu original
    if nombre_arch.endswith('.csv'):
        data = pd.read_csv('src/files/originalfiles/'+str(nombre_arch), sep=',', encoding='utf-8')   
    elif nombre_arch.endswith('.tsv'):
        data = pd.read_csv('src/files/originalfiles/'+str(nombre_arch), sep='\t', encoding='utf-8')   
    elif (nombre_arch.endswith(".xls") or nombre_arch.endswith(".xlsm") or nombre_arch.endswith(".xlsb") or nombre_arch.endswith(".xlsx")):
        data = pd.read_excel('src/files/originalfiles/'+str(nombre_arch)) 
    data['cat_texto'] = nueva_colum  # pegarle la columna cat_text
    return data

def insert_to_json(data, dictJSON, nombre_arch):
    dictJSON.update({'////////////////////////////////////':'START OF THE ORIGINAL DOCUMENT ////////////////////////////////////'}) ## CONSERVAR?????
    # Unir los dos diccionarios de esta manera:
    # textos taggeados + documento original
    final_dict = {**dictJSON, **data}
    # guardar el documento tageado
    # guardar el documento tageado
    with open("src/files/taggedfiles/mode2/TAGGED_" + nombre_arch, "w", encoding='utf-8') as f:  
        json.dump(final_dict, f, ensure_ascii=False)
    print("src/files/taggedfiles/mode2/TAGGED_" + str(nombre_arch)) # pasarle a js la dir con el nombre

def cambiar_tipo_arch(data, nombre_arch):
    #cambiar el nombre y tipo del documento original y guardarlo
    if sys.argv[2] == 'csv':
        nuevo_nombre = renombrar_docu('.csv', nombre_arch) # cambiar nombre
        data.to_csv('src/files/taggedfiles/mode2/TAGGED_' + str(nuevo_nombre), sep=',', encoding='utf-8', index = False)  # guardar docu taggeado
    elif sys.argv[2] == 'tsv':
        nuevo_nombre = renombrar_docu('.tsv', nombre_arch) # cambiar nombre
        data.to_csv('src/files/taggedfiles/mode2/TAGGED_' + str(nuevo_nombre), sep='\t', encoding='utf-8', index = False)  # guardar docu taggeado  
    elif sys.argv[2] == 'excel':
        nuevo_nombre = renombrar_docu('.xlsx', nombre_arch) # cambiar nombre
        data.to_excel('src/files/taggedfiles/mode2/TAGGED_' + str(nuevo_nombre), encoding='utf-8', index = False) # guardar docu taggeado  
    elif sys.argv[2] == 'json':
        nuevo_nombre = renombrar_docu('.json', nombre_arch) # cambiar nombre
        with open('src/files/taggedfiles/mode2/TAGGED_'+ str(nuevo_nombre), 'w', encoding='utf-8') as f: # abrirlo con encoding utf-8
            data.to_json(f, orient='records', force_ascii=False)  # guardar docu taggeado  
    return nuevo_nombre
   

def renombrar_docu(tipo, nombre):
    if nombre.endswith('.csv'):
        nombre = nombre.replace('.csv', tipo)
    elif nombre.endswith('.tsv'):
        nombre = nombre.replace('.tsv', tipo)
    elif nombre.endswith(".xls"):
        nombre = nombre.replace('.xls', tipo)
    elif nombre.endswith(".xlsm"):
        nombre = nombre.replace('.xlsm', tipo)
    elif nombre.endswith(".xlsb"):
        nombre = nombre.replace('.xlsb', tipo)
    elif nombre.endswith(".xlsx"):
        nombre = nombre.replace('.xlsx', tipo)
    return nombre


def consultar_bd(qry):
    try:
        connection = mysql.connector.connect(host='localhost',
                                             database='AustenRiggs',
                                             user='pablohoney',
                                             password='Pikachuy1-')
        try:
            cursor = connection.cursor()
            cursor.execute(qry)
            consulta = cursor.fetchall()
        except Error as e:
            print("Error consulta: ", e)
    except Error as er:
        print("Error while connecting to MySQL", er)
    return consulta