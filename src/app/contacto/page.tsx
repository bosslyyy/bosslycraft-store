import { LegalPage } from "@/components/legal-page";

export default function Page() {
  const discordLink =
    process.env.DISCORD_LINK ?? "https://discord.gg/SVGqVEsjcd";

  return (
    <LegalPage title="Contacto">
      <p>
        ¿Tienes un problema con una compra? Escríbenos indicando tu usuario y
        el identificador del pago. Nunca envíes datos de tarjeta.
      </p>
      <a
        className="pixel-button inline-block px-5 py-3 font-semibold text-white"
        href="mailto:bosslydiscord@gmail.com"
      >
        bosslydiscord@gmail.com
      </a>
      <p>Tiempo habitual de respuesta por correo: 1–3 días laborables.</p>
      <p>
        Si quieres recibir soporte más rápido, entra a nuestro Discord y abre
        un ticket.
      </p>
      <a
        className="pixel-button inline-block px-5 py-3 font-semibold text-white"
        href={discordLink}
        target="_blank"
        rel="noreferrer"
      >
        Abrir un ticket en Discord
      </a>
    </LegalPage>
  );
}
