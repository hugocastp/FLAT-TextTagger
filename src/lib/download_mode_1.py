#############################################################################################
#                                        MODO 1
#
#                     id    texto    otro             cat_texto
#                      5    "hola"   0.5      "CAT1, CAT2, ... , CATN"
#                     --------------------    -----------------------
#                             ^                         ^
#                      DATOS ORIGINALES        CATEGORIAS ETIQUETADAS
#############################################################################################
import pandas as pd
import mysql.connector
import json
from mysql.connector import Error
import sys
import download_mode_2
nueva_colum = []

def seleccionar_modo():
    if sys.argv[3] == 'optionone':
        ##############################      MODO 1      ######################################
        comparar_hash()
    elif sys.argv[3] == 'optiontwo':
        ##############################      MODO 2      ######################################
        download_mode_2.comparar_hash(sys.argv[1],sys.argv[2])

def comparar_hash():   
    qry = "SELECT idDocument FROM documents WHERE hash =" + "'" + sys.argv[1] + "'" 
    idDocu = consultar_bd(qry) # traer el idDocument con el hash
    get_data(idDocu[0][0])

def get_data(idDocu):
    # obtener los idDialogInterview que sean del documento solicitado
    qry = "SELECT idDialogInterview FROM DialogInterviews WHERE idDocument =" +  str(idDocu)
    idDialog = consultar_bd(qry)
    
    # obtener en un array los nombres de las categorias usadas
    for i in range(0, len(idDialog)):
        qry = """SELECT DISTINCT title FROM cat_tags, tagged_process, DialogInterviews
                            WHERE tagged_process.idDialogInterview = DialogInterviews.idDialogInterview AND
                            tagged_process.id_cat_tag = cat_tags.id_cat_tag AND DialogInterviews.idDialogInterview ="""+ str(idDialog[i][0]) 
        lista_nombres = consultar_bd(qry) # vector con los nombres de las cat que se usan
        formatear_array(lista_nombres,nueva_colum)  # formatear tupla a un vector unidimencional
    nombre_arch = obtener_nombre_arch(idDocu) # obtener el nombre de archivo para guardado
    if (nombre_arch.endswith('json') and sys.argv[2] == 'json'):
        #############################################################################
        # SOLO FUNCIONA CUANDO VIENE DE UN JSON Y SE DESCARGA COMO JSON
        #############################################################################
       
        # obtener el contenido de los textos originales
        qry = "SELECT content FROM DialogInterviews WHERE idDocument =" +  str(idDocu)
        content = consultar_bd(qry)
        # formatear los no taggeados con la leyenda "NotTagged"
        for i in range(0, len(nueva_colum)):
            if nueva_colum[i] == '':
               nueva_colum[i] = 'NotTaggged'
        # obtener una lista de los textos
        lista_textos =  formatear_tupla(content)
        # obtener una tupla entre los textos con sus keys(cats)
        listaJSON = []
        listaJSON = list(zip(nueva_colum,lista_textos))
        # sacar una lista con las categorias sin repetir
        cats_sin_repetir = []
        [cats_sin_repetir.append(x) for x in nueva_colum if x not in cats_sin_repetir] 
        # sacar una lista de dos dimenciones el cual, la primera dimencion es la key(cats)
        # y la segunda seram una lista de los textos que cumplan con esa key
        lista_final = []
        for i in range(0,len(cats_sin_repetir)):
            nueva_lista = []
            for j in range(0,len(listaJSON)):
                if cats_sin_repetir[i] == listaJSON[j][0]:
                    nueva_lista.append(listaJSON[j][1])
            lista_final.append(nueva_lista)
        # convertir la lista en un diccionario
        dictJSON = {cats_sin_repetir[i]: lista_final[i] for i in range(0, len(cats_sin_repetir))}
        # guardarlo
        with open('src/files/originalfiles/'+str(nombre_arch), encoding='utf-8') as f: # abrirlo con encoding utf-8
            data = json.load(f)   
            insert_to_json(data, dictJSON, nombre_arch) #juntar el diccionario con el json original
        
    else:
        data = abrir_docu(nombre_arch) # abrir el documento original y pegarle el vector
        nuevo_nombre = cambiar_tipo_arch(data, nombre_arch) #cambiar el nombre y tipo de documento
        print("src/files/taggedfiles/mode1/TAGGED_" + str(nuevo_nombre)) # pasarle a js la dir con el nombre


def formatear_array(nombres, nueva_colum):
    # por alguna razon la consulta me devuelve una tupla como respuesta
    # lo que hago aqui es llenar un arreglo unidimencional que se usara como columna
    categorias = ""
    primera_pasada = True
    for x in nombres:
        if primera_pasada:
            categorias = x[0]
            primera_pasada = False
        else:
            categorias = categorias + ',' + x[0]
    nueva_colum.append(categorias)  # columna que se usara

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


def abrir_docu(nombre_arch):
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
    with open("src/files/taggedfiles/mode1/TAGGED_" + nombre_arch, "w", encoding='utf-8') as f:  
        json.dump(final_dict, f, ensure_ascii=False)
    print("src/files/taggedfiles/mode1/TAGGED_" + str(nombre_arch)) # pasarle a js la dir con el nombre

def cambiar_tipo_arch(data, nombre_arch):
    # cambiar el nombre y tipo del documento original y guardarlo
    if sys.argv[2] == 'csv':
        nuevo_nombre = renombrar_docu('.csv', nombre_arch) # cambiar nombre
        data.to_csv('src/files/taggedfiles/mode1/TAGGED_' + str(nuevo_nombre), sep=',', encoding='utf-8', index = False)  # guardar docu taggeado
    elif sys.argv[2] == 'tsv':
        nuevo_nombre = renombrar_docu('.tsv', nombre_arch) # cambiar nombre
        data.to_csv('src/files/taggedfiles/mode1/TAGGED_' + str(nuevo_nombre), sep='\t', encoding='utf-8', index = False)  # guardar docu taggeado  
    elif sys.argv[2] == 'excel':
        nuevo_nombre = renombrar_docu('.xlsx', nombre_arch) # cambiar nombre
        data.to_excel('src/files/taggedfiles/mode1/TAGGED_' + str(nuevo_nombre), encoding='utf-8', index = False) # guardar docu taggeado  
    elif sys.argv[2] == 'json':
        nuevo_nombre = renombrar_docu('.json', nombre_arch) # cambiar nombre
        with open('src/files/taggedfiles/mode1/TAGGED_'+ str(nuevo_nombre), 'w', encoding='utf-8') as f: # abrirlo con encoding utf-8
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
    elif nombre.endswith(".json"):
        nombre = nombre.replace('.json', tipo)
    return nombre


def consultar_bd(qry):
    try:
        connection = mysql.connector.connect(host='db',
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


seleccionar_modo()