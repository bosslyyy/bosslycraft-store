import { LegalPage } from "@/components/legal-page";

export default function Page() {
  return (
    <LegalPage title="Política de privacidad">
      <p>
        Tratamos el nombre de usuario, rango, importe, estado, fechas e
        identificadores técnicos del pago para entregar el servicio y atender
        incidencias.
      </p>
      <p>
        Los datos de pago son procesados directamente por Tebex y no llegan a
        nuestros servidores. Conservamos los registros de compra durante el
        tiempo necesario para obligaciones operativas y legales.
      </p>
      <p>
        Puedes solicitar acceso o eliminación mediante la página de contacto,
        sujeto a las obligaciones de conservación aplicables.
      </p>
    </LegalPage>
  );
}
