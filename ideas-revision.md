# Revisión Weather CLI

- [x] **Colores:** no hay ninguno; falta definir cyan (menú), amarillo (temp), verde/rojo (ok/error).

- [ ] **AGENTS.md:** dice que `index.ts` es stub, pero la app ya funciona — hay que actualizarlo.
- [ ] **Ciudades:** geocoding solo trae 1 resultado; nombres ambiguos pueden fallar.
- [ ] **Tests:** no existen; conviene al menos probar storage y las APIs con mocks.
- [ ] **Binario:** compila bien; revisar que `./weather` guarde datos en `~/.config/weather-cli/`.
- [ ] **Escalabilidad:** ¿qué tan fácil será expandir con nuevas funcionalidades?
- [ ] **Carga:** ¿hay estado de carga en las tareas asíncronas?
- [x] **7 day forecast:** agregar la posibilidad de obtener el pronóstico del clima para los próximos 7 días.

## CheckList adicional de revisión:

- [ ] ¿Usaron ramas?
- [ ] ¿Usaron pull requests?
- [ ] ¿Qué pasa si tras un nuevo feature, se rompió otra cosa?
- [ ] ¿Hicieron el testing? ¿Qué probaron?
- [ ] ¿Su modelo instaló dependencias? ¿Qué dependencias instaló? ¿Están de acuerdo ustedes?
- [ ] ¿Comprenden el código? ¿Qué es lo que hace? ¿Qué es lo que no hace?
