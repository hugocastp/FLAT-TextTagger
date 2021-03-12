import pandas as pd
import sys
import json
import pathjson
import os
from nested_lookup import nested_lookup

def tipos_archivos():
    # comparar los archivos
    #print(sys.argv[1], sys.argv[2], sys.argv[3])
    if sys.argv[1].endswith(".csv"):
        mostrar_headers('csv')
    elif sys.argv[1].endswith(".tsv"):
        mostrar_headers('tsv')
    elif (sys.argv[1].endswith(".xls") or sys.argv[1].endswith(".xlsm") or sys.argv[1].endswith(".xlsb") or sys.argv[1].endswith(".xlsx")):
        mostrar_headers('excel')
    elif sys.argv[1].endswith(".json"):
        mostrar_headers('json')
    else:
        print("Tipo de archivo no compatible.")

def mostrar_headers(tipo):
    try:
        if tipo == 'csv':
            data = pd.read_csv(sys.argv[1], encoding='utf-8')
            headers = data.columns.values
        elif tipo == 'tsv':
            data = pd.read_csv(sys.argv[1], sep='\t', encoding='utf-8')
            headers = data.columns.values
        elif tipo == 'excel':
            data = pd.read_excel(sys.argv[1])
            headers = data.columns.values
        elif tipo == 'json':
            os.chmod(sys.argv[1], 0o777)
            headers = pathjson.show_path(sys.argv[1])

        formated_headers = format_string(headers) 
        f_name = sys.argv[1].split('/')[-1]
        print(formated_headers) #enviar a js las rutas/headers
        print(sys.argv[1])
        print(f_name)

    except FileNotFoundError:
        print("Error: el directorio del archivo", sys.argv[1], "no existe.")

def format_string(headers):
    # formatear a solo un string separados por ","
    formated_headers = ""
    primero = True
    for i in headers:
        if primero:
            formated_headers = str(i)
            primero = False
        else:
            formated_headers = formated_headers + "," + str(i)
    return formated_headers

tipos_archivos()