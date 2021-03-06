'use strict';
angular
  .module('softvApp')
  .controller('QuejaEjecutaCtrl', function ($state, ngNotify, $location, $uibModal, ordenesFactory, $stateParams, atencionFactory, quejasFactory) {

    function InitalData() {
      vm.clv_queja = $stateParams.id;
      vm.contrato = $stateParams.contrato;
      vm.Servicio = $stateParams.servicio;
      quejasFactory.ValidaQueja(vm.clv_queja).then(function (data) {
        if (data.GetDeepValidaQuejaCompaniaAdicResult.Valida == 0) {
          var param = {};
          param.contrato = vm.contrato;
          param.servicio = vm.Servicio;
          param.op = 0;
          atencionFactory.buscarCliente(param).then(function (data) {

            var detalle = data.GetuspBuscaContratoSeparado2ListResult[0];
            var contrato = detalle.ContratoBueno;
            vm.GlobalContrato = contrato;
            vm.NombreCliente = detalle.Nombre + detalle.Apellido_Paterno + " " + detalle.Apellido_Materno;
            vm.Calle = detalle.CALLE;
            vm.Numero = detalle.NUMERO;
            vm.Colonia = detalle.COLONIA;
            vm.Ciudad = detalle.CIUDAD;
            vm.Telefono = 123456;
            atencionFactory.getServiciosCliente(contrato).then(function (data) {
              vm.ServiciosCliente = data.GetDameSerDelCliFacListResult;

              quejasFactory.ConsultaQueja($stateParams.id).then(function (data) {
                console.log(data);
                var detqueja = data.GetQuejasListResult[0];
                vm.UsuarioGenero = detqueja.UsuarioGenero;
                vm.UsuarioEjecuto = detqueja.UsuarioEjecuto;
                vm.TecnicoAgenda = detqueja.NombreTecAge;
                vm.TurnoAgenda = detqueja.TurnoAge;
                vm.FechaAgenda = detqueja.FechaAge;
                vm.ComentarioAgenda = detqueja.ComentarioAge;
                vm.DetalleProblema = detqueja.Problema;
                vm.Observaciones = detqueja.Observaciones;
                vm.DetalleSolucion = detqueja.Solucion;
                var fsolicitud = detqueja.Fecha_Soliciutud.split(' ');
                vm.FechaSolicitud = fsolicitud[0];
                var hora = getTime(detqueja.Fecha_Soliciutud);
                vm.HoraSolicitud = hora;

                if (detqueja.Fecha_Ejecucion != null) {
                  var fejecucion = detqueja.Fecha_Ejecucion.split(' ');
                  vm.FechaEjecucion = fejecucion[0];
                  var horaEjecucion = getTime(detqueja.Fecha_Ejecucion);
                  vm.HoraEjecucion = horaEjecucion;
                }


                if (detqueja.FechaProceso != null) {
                  var fproceso = detqueja.FechaProceso.split(' ');
                  vm.FechaProceso = fproceso[0];
                  vm.HoraProceso = getTime(detqueja.FechaProceso);


                }


                if (detqueja.Visita1 != null) {

                  var fvisita1 = detqueja.Visita1.split(' ');
                  vm.Fechavisita1 = fvisita1[0];
                  vm.Horavisita1 = getTime(detqueja.Visita1);

                  vm.FVisita3 = true;
                  vm.FVisita2 = true;
                }
                if (detqueja.Visita2 != null) {

                  var fvisita2 = detqueja.Visita2.split(' ');
                  vm.Fechavisita2 = fvisita2[0];
                  vm.Horavisita2 = getTime(detqueja.Visita2);

                  vm.FVisita3 = true;
                  vm.FVisita1 = true;
                }
                if (detqueja.Visita3 != null) {

                  var fvisita3 = detqueja.Visita3.split(' ');
                  vm.Fechavisita3 = fvisita3[0];
                  vm.Horavisita3 = getTime(detqueja.Visita3);
                  vm.FVisita1 = true;
                  vm.FVisita2 = true;
                }
                if (detqueja.EjecucuionReal != null) {

                  var fEjecucuionReal = detqueja.EjecucuionReal.split(' ');
                  vm.FechaEjecucuionReal = fEjecucuionReal[0];
                  vm.HoraEjecucuionReal = getTime(detqueja.EjecucuionReal);
                }

                vm.Departamento = detqueja.Clasificacion;
                vm.Clv_trabajo = detqueja.Clv_Trabajo;
                vm.Clv_prioridad = detqueja.clvPrioridadQueja;
                vm.Clv_problema = detqueja.clvProblema;
                vm.ProblemaReal = detqueja.Solucion;
                vm.Visita = detqueja.Visita;
                vm.Clv_status = detqueja.Status;
                vm.Estatus = 'E';
                Bloqueo(true);



                quejasFactory.ObtenTecnicos(vm.GlobalContrato).then(function (data) {
                  vm.Tecnicos = data.GetMuestra_Tecnicos_AlmacenListResult;
                  if (detqueja.Clave_Tecnico != null) {
                    for (var a = 0; a < vm.Tecnicos.length; a++) {
                      if (vm.Tecnicos[a].clv_Tecnico == detqueja.Clave_Tecnico) {
                        vm.Tecnico = vm.Tecnicos[a];
                      }
                    }
                  }
                });

                atencionFactory.MuestraTrabajos(vm.Servicio).then(function (data) {
                  vm.Trabajos = data.GetMUESTRATRABAJOSQUEJASListResult;
                  for (var a = 0; a < vm.Trabajos.length; a++) {
                    if (vm.Trabajos[a].CLV_TRABAJO == vm.Clv_trabajo) {
                      vm.Trabajo = vm.Trabajos[a];
                    }
                  }
                });

                quejasFactory.ObtenPrioridad().then(function (data) {
                  vm.Prioridades = data.GetSoftv_GetPrioridadQuejaListResult;
                  for (var a = 0; a < vm.Prioridades.length; a++) {
                    if (vm.Prioridades[a].clvPrioridadQueja == vm.Clv_prioridad) {
                      vm.Prioridad = vm.Prioridades[a];
                    }
                  }
                });
                atencionFactory.getServicios().then(function (data) {
                  vm.Servicios = data.GetMuestraTipSerPrincipalListResult;
                  for (var a = 0; a < vm.Servicios.length; a++) {
                    if (vm.Servicios[a].Clv_TipSerPrincipal == vm.Servicio) {
                      vm.Servicio = vm.Servicios[a];
                    }
                  }
                });

                ordenesFactory.serviciosCliente(vm.GlobalContrato).then(function (data) {
                  vm.servicioscli = data.GetDameSerDelCliFacListResult;
                });

                atencionFactory.GetClasificacionProblemas().then(function (data) {
                  vm.Problemas = data.GetuspConsultaTblClasificacionProblemasListResult;
                  for (var a = 0; a < vm.Problemas.length; a++) {
                    if (vm.Problemas[a].clvProblema == vm.Clv_problema) {
                      vm.Problema = vm.Problemas[a];
                    }
                  }
                });

              });

            });



          });
        } else {
          $state.go('home.procesos.reportes');
          ngNotify.set('La Queja pertenece  a un contrato de plazas adicionales al usuario, no puede ejecutarla', 'error');
        }
      });
    }

    function dateParse(date) {
      var realdate = date.split(" ")
      var strDate = realdate[0];
      var dateParts = strDate.split("/");
      var date = new Date(dateParts[2], (dateParts[1] - 1), dateParts[0]);
      if (dateParts[0].length == 1) {
        var dia = '0' + ateParts[0];
      }
    }


    function getTime(date) {
      var fejecucion = date.split(' ');

      if (fejecucion.length == 3) {
        return fejecucion[2];
      } else if (fejecucion.length == 4) {
        var hora = fejecucion[3].split(':');
        if (hora[0].length == 1) {
          return '0' + fejecucion[3];
        } else {
          return fejecucion[3];
        }

      }
    }


    function abrirBonificacion() {
      var detalle = {};
      detalle.Block = true;
      detalle.Queja = vm.clv_queja;
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'views/procesos/ModalBonificacion.html',
        controller: 'ModalBonificacionCtrl',
        controllerAs: 'ctrl',
        backdrop: 'static',
        keyboard: false,
        size: 'md',
        resolve: {
          detalle: function () {
            return detalle;
          }
        }
      });
    }

    function toDate(dateStr) {
      var parts = dateStr.split("/");
      return new Date(parts[2], parts[1] - 1, parts[0]);
    }


    function ValidaFecha(fechaIngresada, fechasolicitud) {
      console.log(fechaIngresada, fechasolicitud);

      var _fechaHoy = new Date();
      var _fechaIngresada = toDate(fechaIngresada);
      var _fechasolicitud = toDate(fechasolicitud);

      console.log(_fechaHoy, _fechaIngresada, _fechasolicitud)

      if ((_fechaIngresada > _fechasolicitud && _fechaIngresada < _fechaHoy) || _fechasolicitud.toDateString() === _fechaIngresada.toDateString()) {
        console.log(true);
        return true;

      } else {
        console.log(false);
        return false;
      }

    }

    function Bloqueo(aplicabloqueo) {
      if (vm.Estatus == 'E') {
        vm.FEjecucion = false;
        vm.FVisita1 = true;
        vm.FVisita2 = true;
        vm.FVisita3 = true;
        vm.FProceso = true;
        vm.Iejecucion = 'input-yellow';
        vm.Ivisita = 'input-normal';
        vm.Iproceso = 'input-normal';
      } else if (vm.Estatus == 'V') {

        vm.FEjecucion = true;
        vm.FProceso = true;

        if (vm.Fechavisita1 == null) {
          vm.FVisita1 = false;
          vm.FVisita2 = true;
          vm.FVisita3 = true;

          vm.Ivisita1 = 'input-yellow';
          vm.Ivisita2 = 'input-normal';
          vm.Ivisita3 = 'input-normal';
        }

        if (vm.Fechavisita2 == null && vm.Fechavisita1 != null) {
          vm.FVisita2 = false;
          vm.FVisita1 = true;
          vm.FVisita3 = true;

          vm.Ivisita2 = 'input-yellow';
          vm.Ivisita1 = 'input-normal';
          vm.Ivisita3 = 'input-normal';
        }

        if (vm.Fechavisita3 == null && vm.Fechavisita2) {
          vm.FVisita3 = false;
          vm.FVisita1 = true;
          vm.FVisita3 = true;

          vm.Ivisita2 = 'input-yellow';
          vm.Ivisita1 = 'input-normal';
          vm.Ivisita3 = 'input-normal';
        }

      } else if (vm.Estatus == 'S') {

        vm.FEjecucion = true
        vm.FVisita1 = true;
        vm.FVisita2 = true;
        vm.FVisita3 = true;
        vm.FProceso = false;

        vm.Iejecucion = 'input-normal';
        vm.Ivisita1 = 'input-normal';
        vm.Ivisita2 = 'input-normal';
        vm.Ivisita3 = 'input-normal';
        vm.Iproceso = 'input-yellow';
      }
    }

    function CambiaEstatus() {
      Bloqueo();
    }

    function Ejecutaqueja() {
      quejasFactory.ValidaQueja(vm.clv_queja).then(function (data) {
        if (data.GetDeepValidaQuejaCompaniaAdicResult.Valida == 0) {
          quejasFactory.BuscaBloqueado(vm.GlobalContrato).then(function (bloqueado) {
            if (bloqueado.GetDeepBuscaBloqueadoResult.Bloqueado == 0) {

              if (vm.Estatus == 'E') {
                alert('ejecutado');
                if (vm.FechaEjecucion == undefined) {
                  ngNotify.set('Seleccione la fecha de ejecución', 'error');
                  return;
                } else {
                  alert('aqui');
                  if (ValidaFecha(vm.FechaEjecucion, vm.FechaSolicitud) == false) {
                    ngNotify.set('La fecha de ejecución no puede ser menor a la fecha de solicitud ni mayor a la fecha actual', 'warn');
                    return;
                  }
                }
              } else if (vm.Estatus == 'V') {

                if (vm.Fechavisita1 != undefined &&
                  vm.Fechavisita2 == undefined &&
                  vm.Fechavisita3 == undefined) {
                  if (ValidaFecha(vm.Fechavisita1, vm.FechaSolicitud) == false) {
                    ngNotify.set('La fecha de ejecución no puede ser menor a la fecha de solicitud ni mayor a la fecha actual', 'warn');
                    return;
                  }
                } else if (vm.Fechavisita1 != undefined &&
                  vm.Fechavisita2 == undefined &&
                  vm.Fechavisita3 == undefined) {

                  if (ValidaFecha(vm.Fechavisita2, vm.FechaSolicitud) == false) {
                    ngNotify.set('La fecha de visita no puede ser menor a la fecha de solicitud ni mayor a la fecha actual', 'warn');
                    return;
                  }
                } else if (vm.Fechavisita1 != undefined &&
                  vm.Fechavisita2 != undefined &&
                  vm.Fechavisita3 != undefined) {
                  if (ValidaFecha(vm.Fechavisita3, vm.FechaSolicitud) == false) {
                    ngNotify.set('La fecha de visita no puede ser menor a la fecha de solicitud ni mayor a la fecha actual', 'warn');
                    return;
                  }
                }

              } else if (vm.Estatus == 'S') {

                if (ValidaFecha(vm.FechaProceso, vm.FechaSolicitud) == false) {
                  ngNotify.set('La fecha de proceso no puede ser menor a la fecha de solicitud ni mayor a la fecha actual', 'warn');
                  return;
                }

              }

              if (vm.Estatus == 'E') {
                var obj = {};
                obj.Clv_Queja = vm.clv_queja;
                obj.Status = 'E';
                obj.Fecha_Ejecucion = vm.FechaEjecucion;
                obj.Visita1 = '';
                obj.Visita2 = '';
                obj.Visita3 = '';
                obj.HV1 = '';
                obj.HV2 = '';
                obj.HV3 = '';
                obj.FechaProceso = '';
                obj.HP = '';
                obj.Visita = false;
                obj.Clv_Tecnico = vm.Tecnico.clv_Tecnico;
                obj.clvProblema = vm.Problema.clvProblema;
                obj.clvPrioridadQueja = vm.Prioridad.clvPrioridadQueja;
                obj.Solucion = vm.ProblemaReal;
                console.log(obj);
                quejasFactory.UpdateQuejas(obj).then(function (data) {

                  ngNotify.set('La queja se aplicó  correctamente', 'success');
                  $state.go('home.procesos.reportes');
                });
              }
              if (vm.Estatus == 'V') {
                var obj = {};
                obj.Clv_Queja = vm.clv_queja;
                obj.Status = 'V';
                obj.Fecha_Ejecucion = '';
                obj.Visita1 = (vm.Fechavisita1 == undefined) ? '' : vm.Fechavisita1;
                obj.Visita2 = (vm.Fechavisita2 == undefined) ? '' : vm.Fechavisita2;
                obj.Visita3 = (vm.Fechavisita2 == undefined) ? '' : vm.Fechavisita3;
                obj.HV1 = (vm.Horavisita1 == undefined) ? '' : vm.Horavisita1;
                obj.HV2 = (vm.Horavisita2 == undefined) ? '' : vm.Horavisita2;
                obj.HV3 = (vm.Horavisita3 == undefined) ? '' : vm.Horavisita3;
                obj.FechaProceso = '';
                obj.HP = '';
                obj.Visita = false;
                obj.Clv_Tecnico = vm.Tecnico.clv_Tecnico;
                obj.clvProblema = vm.Problema.clvProblema;
                obj.clvPrioridadQueja = vm.Prioridad.clvPrioridadQueja;
                obj.Solucion = vm.ProblemaReal;
                console.log(obj);
                quejasFactory.UpdateQuejas(obj).then(function (data) {

                  ngNotify.set('La queja se aplicó  correctamente', 'success');
                  $state.go('home.procesos.reportes');
                });

              }
              if (vm.Estatus == 'S') {
                var obj = {};
                obj.Clv_Queja = vm.clv_queja;
                obj.Status = 'S';
                obj.Fecha_Ejecucion = '';
                obj.Visita1 = '';
                obj.Visita2 = '';
                obj.Visita3 = '';
                obj.HV1 = '';
                obj.HV2 = '';
                obj.HV3 = '';
                obj.FechaProceso = vm.FechaProceso;
                obj.HP = vm.HoraProceso;
                obj.Visita = false;
                obj.Clv_Tecnico = vm.Tecnico.clv_Tecnico;
                obj.clvProblema = vm.Problema.clvProblema;
                obj.clvPrioridadQueja = vm.Prioridad.clvPrioridadQueja;
                obj.Solucion = vm.ProblemaReal;

                console.log(obj);
                quejasFactory.UpdateQuejas(obj).then(function (data) {

                  ngNotify.set('La queja se aplicó  correctamente', 'success');
                  $state.go('home.procesos.reportes');
                });

              }





            } else {
              ngNotify.set('El cliente, ha sido bloqueado, por lo que no se podrá ejecutar la orden', 'error');
            }
          });

        } else {

          ngNotify.set('La Queja pertenece  a un contrato de plazas adicionales al usuario, no puede ejecutarla', 'error');
        }
      });
    }


    function MuestraAgenda() {

      var options = {};
      options.TecnicoAgenda = vm.TecnicoAgenda;
      options.TurnoAgenda = vm.TurnoAgenda;
      options.FechaAgenda = vm.FechaAgenda;
      options.ComentarioAgenda = vm.ComentarioAgenda;
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'views/procesos/ModalAgenda.html',
        controller: 'ModalAgendaQuejaCtrl',
        controllerAs: 'ctrl',
        backdrop: 'static',
        keyboard: false,
        size: 'sm',
        resolve: {
          options: function () {
            return options;
          }
        }
      });

    }

    function DescargaMaterial() {
      var modalInstance = $uibModal.open({
        animation: vm.animationsEnabled,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: 'views/procesos/ModalDescargaMaterial.html',
        controller: 'ModalDescargaMaterialCtrl',
        controllerAs: 'ctrl',
        backdrop: 'static',
        keyboard: false,
        size: 'md',
        resolve: {
          // contrato: function() {
          // 	return vm.GlobalContrato;
          // }
        }
      });
    }
    var vm = this;
   
    InitalData();
    vm.Titulo = 'Ejecutar Queja';
    vm.abrirBonificacion = abrirBonificacion;
    vm.CambiaEstatus = CambiaEstatus;
    vm.Ejecutaqueja = Ejecutaqueja;
    vm.DescargaMaterial = DescargaMaterial;
    vm.MuestraAgenda = MuestraAgenda;
    vm.Iprioridad = true;
    vm.IDetProblema = true;
    vm.IClasproblema = true;
    vm.Iprobreal = false;
    vm.Iobser = true;
    vm.IEstatus = true;

  });
