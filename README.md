#Demo de importar CSV, con conversión de encoding.

Utiliza `legacy-encoding` para la conversión, y `csv-string` para parsear el CSV.

La conversión se esta haciendo del lado del navegador, _no del lado del server!_

Si presionas el boton de enviar, se manda al lado de node, el cual solo usa `console.log` para mostrar lo que se recibio (y de esa forma mostrar que si se este mandando bien)
