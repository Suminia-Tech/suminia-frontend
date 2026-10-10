# Pendientes

Lo que ya se pidió y se dejó para después, agrupado por el módulo donde va a
vivir. Cada entrada dice qué se pidió, qué existe hoy en el código y qué hay
que decidir antes de construirlo.

---

## Módulo de logística

Viene de las hojas de revisión del panel del proveedor (Políticas comerciales)
y de la ficha de producto. Las tres piezas se tocan entre sí —el plazo de
entrega depende de la ciudad, y el envío gratis también—, de modo que conviene
diseñarlas juntas y no una por una.

### 1. Tiempo estimado de entrega

**Lo que se pidió**

- Plazo por tipo de ciudad, en días hábiles:
  - Ciudades principales: ___ días hábiles
  - Ciudades secundarias: ___ días hábiles
  - Ciudades terciarias: ___ días hábiles
- ¿Ofreces entrega el mismo día?
  - Ciudades con entrega el mismo día (buscador de ciudad + "agregar ciudad").
  - Hora límite para recibir pedidos (selector de hora).

**Lo que hay hoy**

- Un solo rango por proveedor: `Organization.deliveryDaysMin` /
  `deliveryDaysMax` (migración `20261011150000_favorites_and_delivery_days`).
  Se edita en *Mi empresa → Políticas comerciales → Tiempo de entrega* y se
  muestra en la ficha como "Entrega en 2 a 5 días hábiles".
- El pedido guarda la ciudad de entrega (`Order.deliveryCity`), pero en texto
  libre: no hay catálogo de ciudades.

**Por decidir**

- Quién clasifica las ciudades en principales, secundarias y terciarias:
  Suminia, con una tabla única para todos, o cada proveedor según su
  operación. Con una tabla única, la ficha puede decirle al comprador el plazo
  de *su* ciudad.
- Hace falta un catálogo de ciudades (DANE / DIVIPOLA) para el buscador, y que
  las sedes de entrega del comprador lo usen en vez de texto libre. Si no, no
  hay forma de cruzar la sede con la ciudad del proveedor.
- Hora límite: en hora de Colombia, y qué pasa con un pedido que entra después
  (¿pasa al día hábil siguiente?). Hay que definir también qué es un día hábil:
  ¿se descuentan los festivos?
- Qué pasa con el rango actual (`deliveryDaysMin/Max`): migrarlo a "ciudades
  principales" o retirarlo.

### 2. Devoluciones

Resaltado en amarillo en la hoja.

**Lo que se pidió**

- ¿Aceptas devoluciones? Sí / No.
- Si sí: ¿en qué casos? Producto defectuoso, producto incorrecto.

**Lo que hay hoy**

Nada. El pedido termina en `DELIVERED` y no tiene un estado posterior.
`PaymentStatus` ya contempla `REFUNDED`, pero nada lo usa.

**Por decidir**

- Si basta con declarar la política (un dato del proveedor que se muestra en la
  ficha) o si hace falta el flujo completo: el comprador solicita la
  devolución de un pedido entregado, el proveedor la aprueba y se reembolsa.
  Lo segundo es un estado nuevo en el pedido y toca pagos y liquidaciones.
- Plazo para pedir una devolución después de la entrega.
- Quién paga el flete de vuelta.

### 3. Cobertura y costo de envío

**Lo que se pidió**

1. ¿Ofrece envíos gratuitos?
   - ¿En qué ciudades? (buscador de ciudad + "agregar ciudad").
   - ¿El envío gratuito tiene alguna condición? Sin monto mínimo / a partir de
     un monto mínimo de $___.
2. Valor de envío a otras ciudades: $___.

Y de la ficha de producto: mostrar "Envío gratis" junto a los días de entrega
y el monto mínimo.

**Lo que hay hoy**

Suminia no cobra envío en ningún pedido: `Order` no tiene costo de flete, y el
total es productos + IVA. Por eso no hay nada que se pueda volver "gratis", y
en la ficha se dejó fuera.

Lo que sí existe es el **monto mínimo** del proveedor
(`Organization.minOrderValue`): por debajo de él no despacha. No es lo mismo
que un umbral de envío gratis, que deja pedir por menos y cobra el flete.

**Por decidir**

- Que el pedido lleve un costo de envío (`shippingCost`) calculado al hacerlo,
  según la ciudad de la sede y las reglas del proveedor.
- Si el envío lleva IVA y si la comisión de Suminia se calcula también sobre
  él (hoy se calcula sobre el total con IVA; ver `commission.ts` en el
  backend).
- Cómo conviven el monto mínimo y el envío gratis: ¿un proveedor puede tener
  los dos?
- En el carrito, el aviso "te faltan $X para el envío gratis", que es donde
  esto cambia la compra.
