def findColor(color):
    import mysql.connector
    from mysql.connector import Error
    
    try:
        connection = mysql.connector.connect(host='localhost',
                                             database='AustenRiggs',
                                             user='pablohoney',
                                             password='Pikachuy1-')
        cursor = connection.cursor()
        mySql_query = "select (*) from cat_tags where color = %s"
        val = str(color)
        if cursor.execute(mySql_query,val):
            print('existe')
        else: 
            print('no existe')
            
    except Error as er:
        print("Error: ", er)

    finally:
        if (connection.is_connected()):
            cursor.close()
            connection.close()

st = "#5bff00"
findColor(st)