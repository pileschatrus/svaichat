<?php
// Приём заявок с сайта: письмо на почту и/или сообщение в Telegram-бота.
// Заполните настройки ниже после получения контактов от заказчика.

const MAIL_TO = '';            // e-mail для заявок, напр. 'info@kuzov21.ru'
const MAIL_FROM = '';          // адрес отправителя на домене сайта, напр. 'site@kuzov21.ru'
const TG_BOT_TOKEN = '';       // токен бота от @BotFather
const TG_CHAT_ID = '';         // id чата/группы, куда бот пишет заявки

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  exit(json_encode(['ok' => false]));
}

$in = json_decode(file_get_contents('php://input'), true) ?: [];
$clean = fn($v, $n = 500) => mb_substr(trim(strip_tags((string)($v ?? ''))), 0, $n);

// ловушка для ботов
if (!empty($in['hp'])) exit(json_encode(['ok' => true]));

$name = $clean($in['name'] ?? '', 100);
$phone = preg_replace('/[^\d+]/', '', $clean($in['phone'] ?? '', 30));
$comment = $clean($in['comment'] ?? '', 2000);
$estimate = $clean($in['estimate'] ?? '', 6000);
$source = $clean($in['source'] ?? '', 50);
$page = $clean($in['page'] ?? '', 300);

if (strlen(preg_replace('/\D/', '', $phone)) < 11) {
  http_response_code(422);
  exit(json_encode(['ok' => false, 'error' => 'phone']));
}

// простая защита от повторной отправки: не чаще раза в 20 секунд с одного IP
$ip = $_SERVER['REMOTE_ADDR'] ?? '';
$lock = sys_get_temp_dir() . '/lead_' . md5($ip);
if (is_file($lock) && time() - filemtime($lock) < 20) {
  http_response_code(429);
  exit(json_encode(['ok' => false, 'error' => 'rate']));
}
@touch($lock);

$text = "Новая заявка с сайта\n\n"
  . "Имя: " . ($name ?: '—') . "\n"
  . "Телефон: $phone\n"
  . ($comment ? "Комментарий: $comment\n" : '')
  . "Источник: $source\nСтраница: $page\n"
  . ($estimate ? "\n— Смета —\n$estimate\n" : '');

$sent = false;

if (TG_BOT_TOKEN && TG_CHAT_ID) {
  $ch = curl_init('https://api.telegram.org/bot' . TG_BOT_TOKEN . '/sendMessage');
  curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_POSTFIELDS => ['chat_id' => TG_CHAT_ID, 'text' => mb_substr($text, 0, 4000), 'disable_web_page_preview' => true],
  ]);
  $res = json_decode((string)curl_exec($ch), true);
  curl_close($ch);
  $sent = $sent || !empty($res['ok']);
}

if (MAIL_TO) {
  $headers = "Content-Type: text/plain; charset=utf-8\r\n" . (MAIL_FROM ? "From: " . MAIL_FROM . "\r\n" : '');
  $sent = mail(MAIL_TO, '=?UTF-8?B?' . base64_encode('Заявка с сайта: ' . $phone) . '?=', $text, $headers) || $sent;
}

if (!$sent) {
  // Ничего не настроено или канал недоступен — сохраняем в файл, чтобы заявка не потерялась
  @file_put_contents(__DIR__ . '/../leads.log', date('c') . "\n$text\n-----\n", FILE_APPEND | LOCK_EX);
  $sent = MAIL_TO === '' && TG_BOT_TOKEN === '';
}

echo json_encode(['ok' => $sent]);
