#####   SE EJECUTA DESDE LA LINA DE COMANDOS                          #####
#####   Ejemplo: python issue1.py 'dir_archivo' 'columna_text'        #####
#########################################################################

import insert_to_db
import pandas as pd
import sys
import json
from nested_lookup import nested_lookup
import os, sys, stat


def colum_mas_grande(data):
    primeros_registros = data.head()
    primera_pasada = True
    for y in primeros_registros:
        actual = 0
        for x in range(0, len(primeros_registros.index)):
            actual = len(str(primeros_registros.loc[x, y])) + actual
            if primera_pasada:
                tam_grande = actual
                primera_pasada = False
                texto = y
            if actual > tam_grande:
                tam_grande = actual
                texto = y
    #print("El 'texto' mas grande fue: ", texto)
    return texto

def hash_file():
    import hashlib
    file = sys.argv[1]  # Location of the file (can be set a different way)
    BLOCK_SIZE = 65536  # The size of each read from the file

    # Create the hash object, can use something other than `.sha256()` if you wish
    file_hash = hashlib.sha256()
    with open(file, 'rb') as f:  # Open the file to read it's bytes
        # Read from the file. Take in the amount declared above
        fb = f.read(BLOCK_SIZE)
        while len(fb) > 0:  # While there is still data being read from the file
            file_hash.update(fb)  # Update the hash
            fb = f.read(BLOCK_SIZE)  # Read the next block from the file
    return file_hash.hexdigest()
    # print (file_hash.hexdigest()) # Get the hexadecimal digest of the hash


def detectar_errores(tipo):
    try:
        if tipo == 'csv':
            # para saber si hay error de dir
            data = pd.read_csv(sys.argv[1], encoding='utf-8')
            if sys.argv[2] == "null":
                raise IndexError
            data[sys.argv[2]]  # para error de columna no existente
            texto = sys.argv[2]  # texto para usar como columna
        elif tipo == 'tsv':
            data = pd.read_csv(sys.argv[1], sep='\t', encoding='utf-8')
            if sys.argv[2] == "null":
                raise IndexError
            data[sys.argv[2]]  # para error de columna no existente
            texto = sys.argv[2]  # texto para usar como columna
        elif tipo == 'excel':
            data = pd.read_excel(sys.argv[1])  # para saber si hay error de dir
            if sys.argv[2] == "null":
                raise IndexError
            #data = pd.Series(data, dtype="string")
            #print(data.dtypes)
            #data = data.astype(str)
            #print(data.dtypes)
            data[sys.argv[2]]  # para error de columna no existente
            texto = sys.argv[2]  # texto para usar como columna
        elif tipo == 'json':
            os.chmod(sys.argv[1], 0o777)
            with open(sys.argv[1], encoding='utf-8') as f:
                data = json.load(f)  # para saber si hay error de dir
            path = sys.argv[2].split('/')  # dividir por tokens la dir
            for i in range(0, len(path)):
                # buscar la dir que el usuario puso
                data = nested_lookup(path[i], data)
            if data == []:
                raise KeyError  # levantar error de columna/dir inexistente si data vale nada
            # obtener la columna text que seria la ultima rama de la dir
            texto = path[-1]
        archivo = path_leaf(sys.argv[1])
        hashfile = hash_file()
        # print(archivo)
        # insertar si todo sale bien sin errores
        insert_to_db.insert_data(data, texto, tipo, archivo, hashfile)

    except FileNotFoundError:
        print("Error: el directorio del archivo", sys.argv[1], "no existe.")
    except KeyError:
        print("Error, no existe columna:", sys.argv[2])
    except IndexError:
        print("No se expecifico la columna 'text' se usara la mas grande.")
        if (tipo == 'csv' or tipo == 'tsv' or tipo == 'excel'):
            #print(data)
            texto = colum_mas_grande(data)
            archivo = path_leaf(sys.argv[1])
            hashfile = hash_file()
            insert_to_db.insert_data(data, texto, tipo, archivo, hashfile)
        


def path_leaf(path):
    import ntpath
    head, tail = ntpath.split(path)
    return tail or ntpath.basename(head)

# 1. file name
# 2. column name or route (if it is json)
# 3. sep (if it is csv or tsv)

def tipos_archivos():
    # comparar los archivos
    print(sys.argv[1], sys.argv[2])
    if sys.argv[1].endswith(".csv"):
        detectar_errores('csv')
    elif sys.argv[1].endswith(".tsv"):
        detectar_errores('tsv')
    elif (sys.argv[1].endswith(".xls") or sys.argv[1].endswith(".xlsm") or sys.argv[1].endswith(".xlsb") or sys.argv[1].endswith(".xlsx")):
        detectar_errores('excel')
    elif sys.argv[1].endswith(".json"):
        detectar_errores('json')
    else:
        print("Tipo de archivo no compatible.")


tipos_archivos()