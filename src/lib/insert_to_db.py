#############################################################
# Método que recibe como parámetro un diccionario de python #
#    y lo itera insertando el campo llamado "text" que      #
#        contiene cada instancia del diccionario            #
#############################################################
# Nota: este método no debiera ser modificado en primera
# instancia, ya que lo que se pretende es utilizarlo bajo los
# requisitos anteriormente descritos

def insert_data(data_dictionary, texto, tipo, archivo, hash_file):

    import mysql.connector
    from mysql.connector import Error
    total = 0
    insertados = 0
    # print(archivo,hash_file)
    try:
        connection = mysql.connector.connect(host='db',
                                             database='AustenRiggs',
                                             user='pablohoney',
                                             password='Pikachuy1-')
        # print("##########################################################")
        try:
            from datetime import datetime
            now = datetime.now()
            
            mySql_insert_query = "INSERT INTO documents (name,hash,created_at) VALUES  (%s,%s,%s)"
            val = (str(archivo),str(hash_file),str(now))
            cursor = connection.cursor()
            cursor.execute(mySql_insert_query,val)
            connection.commit()
            r = cursor.rowcount
            # print("Hola:"+str(r))
            cursor.close()

            if (r == 1):
                try:
                    mySql_insert_query = """SELECT idDocument 
                                    FROM documents
                                    ORDER BY idDocument
                                    DESC LIMIT 1"""
                    cursor = connection.cursor()
                    cursor.execute(mySql_insert_query)
                    r1 = cursor.fetchall()
                    r1 = r1[0][0]
                    cursor.close()
                    #print("Uno: "+str(r1))
                    if r1:
                        if (tipo == 'csv' or tipo == 'tsv' or tipo == 'excel'):
                            for index, item in data_dictionary.iterrows():
                                total = total + 1
                                try:
                                    mySql_insert_query = "INSERT INTO DialogInterviews (content,idDocument,tagged) VALUES (%s,%s,'not tagged')" 
                                    val = (str(item[texto]),str(r1))
                                    cursor = connection.cursor()
                                    cursor.execute(mySql_insert_query,val)
                                    connection.commit()
                                    #r2 = cursor.rowcount
                                    #print(r2, "Record inserted successfully: ", str(item[texto]))
                                    cursor.close()
                                    insertados = insertados + 1
                                except Error as er:
                                    print("Error: ", er)

                        elif(tipo == 'json'):
                            for i in range(0,len(data_dictionary)):
                                total = total + 1
                                try:
                                    mySql_insert_query = "INSERT INTO DialogInterviews (content,idDocument,tagged) VALUES (%s,%s,'not tagged')"
                                    val = (str(data_dictionary[i]),str(r1))
                                    cursor = connection.cursor()
                                    cursor.execute(mySql_insert_query, val)
                                    connection.commit()
                                    #r2 = cursor.rowcount
                                    #print(r2, "Record inserted successfully: ", str(item[texto]))
                                    cursor.close()
                                    insertados = insertados + 1
                                except Error as er:
                                    print("Error: ", er)
                except Error as e:
                    print("Error: ", e)
        except Error as e:
            print("Error: ", e)
    except Error as e:
        print("Error while connecting to MySQL", e)
    finally:
        if (connection.is_connected()):
            cursor.close()
            connection.close()
            if total == insertados:
                print("Datos agregados satisfactoriamente")
            else:
                print("No se pudieron agregar todos los datos.")
            # print("##########################################################")
            #print("MySQL connection is closed")
            #print("Registros totales: ",total)
            #print("Registros insertados: ",insertados)
            # print("##########################################################")

#############################################################
#      Código que obtiene un archivo tipo .json y lo        #
#   carga a un diccionario ya con el formato especificado   #
#############################################################
# Nota: este código deberá ser modificado en función del tipo
# de archivo que se quiera leer y como resultado siempre tendrá
# que ser un diccionario con un campo llamado "text" en cada
# una de sus instancias

#import json

#dic = []
# with open("pruebatw.json","r") as read_json:
#    dic = json.load(read_json)

###Se ejecuta el metodo para registrar en la base de datos###
# insert_data(dic)
