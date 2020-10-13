<?php 

        include "databaseconnect.php";
                            
        $desc = $_POST["descricao"];
        $data = $_POST["dia"];
        $hora = $_POST["hora"];
        
        $query = "INSERT INTO eventos (title, start, hora ) VALUES ('$desc', '$data', '$hora')";
        
        
        $exec = $conn->exec($query);                         
        
        if($exec){            
            echo "success";     
        }
        else{
            echo "error";
        }
       
        
?>