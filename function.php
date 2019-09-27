<?php
    function dump($var)
    {
        echo '<pre>';
        print_r($var);
        echo '</pre>';
    }

    function send_mail($name, $email, $message)
    {
        if(!empty($name) && !empty($email) && !empty($message))
        {
            $mailTo = 'kontakt@tmidc.pl';
            $subject = 'Formularz kontaktowy- TMIDC.pl - '.$name;
            $headers = 'From: webmaster@example.com' . "\r\n" .
                       'Reply-To: webmaster@example.com' . "\r\n" .
                       'X-Mailer: PHP/' . phpversion();
$NewMessage = '
Wiadomość nadana przez: '.$name.' - '.$email.'

Treść:

'.$message.'';


            $result = @mail($mailTo, $subject, $NewMessage, $headers);

            if($result)
                return '<span style="color: #0F0">Dziękujemy! <br> Twoja wiadomość została wysłana.</span>';
            else
                return '<span style="color: #F00">Przepraszamy, coś poszło nie tak! <br>Twoja wiadomość nie została wysłana.</span>';
        }        
    }
?>