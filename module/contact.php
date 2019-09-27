<div id="item-page">
    <span>
        <p>Kontakt</p>
    </span>
<?php
if(!isset($_POST['sendmail']))
{
?>


    <form action="index.php?page=contact" method="POST" id="contact-form">
        <input type="text" name="name" placeholder="Imię...">
        <input type="text" name="email" placeholder="Adres e-mail...">
        <textarea name="message" placeholder="Twoja wiadomość..."></textarea>
        <input type="submit" name="sendmail" value="Wyślij wiadomość">
    </form>

<?php
}
else
{
    
    if(empty($_POST['name']) || empty($_POST['email']) || empty($_POST['message']))
    {
        echo '<form action="index.php?page=contact" method="POST" id="contact-form">
                <input type="text" name="name" placeholder="Imię..." style="border: 1px solid #F00">
                <input type="text" name="email" placeholder="Adres e-mail..." style="border: 1px solid #F00">
                <textarea name="message" placeholder="Twoja wiadomość..." style="border: 1px solid #F00"></textarea>
                <input type="submit" name="sendmail" value="Wyślij wiadomość">
            </form>';
    }
    else
    {
        echo '<form action="index.php?page=contact" method="POST" id="contact-form">
                <input type="text" name="name" placeholder="Imię...">
                <input type="text" name="email" placeholder="Adres e-mail...">
                <textarea name="message" placeholder="Twoja wiadomość..."></textarea>
                <input type="submit" name="sendmail" value="Wyślij wiadomość">
            </form>';
        send_mail($_POST['name'], $_POST['email'], $_POST['message']);
    }
}
?>
</div>