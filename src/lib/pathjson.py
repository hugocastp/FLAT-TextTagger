import collections.abc
import json
import os


def get_paths(source):
    paths = []
    if isinstance(source, collections.abc.MutableMapping):  # Busca una estructura tipo diccionario
        for k, v in source.items():  # itera sobre la estructura; para Python 2.x: source.iteritems()
          
            paths.append([k])  # agrega la ruta secundaria actual
           
            paths += [[k] + x for x in get_paths(v)]  # obtener subrutas, agregar a la actual
           
    # de lo contrario, verifique si es una estructura similar a una lista(elimínela si no desea que se incluyan las rutas de la lista)
    elif isinstance(source, collections.abc.Sequence) and not isinstance(source, str):
        for count, item in enumerate(source):
            paths +=  [x for x in get_paths(item)]  # obtener subrutas, agregar a la actual"
    return paths

def show_path(dir):
    f = open(dir, "r")
    os.chmod(f, 0o777)
    content = f.read()
    data = json.loads(content)
    paths = get_paths(data)
    lista = []
    for i in paths:
        ruta = ""
        band = True
        for x in range(0,len(i)):

            if band :
                ruta = str(i[x])
                lista.append(ruta)
                band = False
            else:
                ruta = ruta + "/" + str(i[x])
            #ruta = re.sub("[\d*][.][\d*]", "", ruta)
            #ruta = re.sub("[\d*]", "", ruta)
        
            if ruta.endswith("/"):
                ruta =  ruta[:-1]
            lista.append(ruta)

    newlist = []
    for i in lista:
        if i not in newlist:
            newlist.append(i)

    return newlist