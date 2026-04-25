function escape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderEmailVerificationHtml(
  userName: string,
  verificationUrl: string,
  shopName: string,
): string {
  const safeName = escape(userName);
  const safeUrl = escape(verificationUrl);
  const safeShop = escape(shopName);

  return `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#333;">
    <h2 style="margin:0 0 16px 0;">Подтвердите регистрацию</h2>
    <p>Здравствуйте, ${safeName}!</p>
    <p>Спасибо за регистрацию в магазине <strong>${safeShop}</strong>. Чтобы завершить регистрацию, подтвердите ваш email:</p>
    <p style="margin:28px 0;">
      <a href="${safeUrl}"
         style="display:inline-block;padding:12px 28px;background:#0d6efd;color:#fff;text-decoration:none;border-radius:6px;font-weight:600;">
        Подтвердить email
      </a>
    </p>
    <p style="font-size:13px;color:#666;">Если кнопка не работает, скопируйте ссылку в адресную строку браузера:</p>
    <p style="font-size:13px;color:#666;word-break:break-all;">${safeUrl}</p>
    <p style="font-size:13px;color:#888;margin-top:32px;">
      Ссылка действительна 24 часа. Если вы не регистрировались на ${safeShop}, просто проигнорируйте это письмо.
    </p>
  </div>`;
}
