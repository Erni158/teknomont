<?php
    $homepage = 'home';
    include("function.php");

    include("module/header.php");

    if(empty($_GET) || !isset($_GET['page']))
        include('module/'.$homepage.'.php');
    else
    {
        if(file_exists('module/'.$_GET['page'].'.php'))
            include('module/'.$_GET['page'].'.php');
        else
        include('module/error.php');
    }
    include("module/footer.php");
?>