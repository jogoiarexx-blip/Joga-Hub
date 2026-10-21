/* JogaHub — recuperação de conexão para o player Google Drive.
 * Lógica pura: não acessa rede, timers, DOM ou dados privados.
 * Uma reconexão é consumida apenas uma vez e nunca ignora o modo manual.
 */
(function(root){
  'use strict';
  function makeGate(){
    let pending=null;
    let epoch=0;
    function arm(kind){
      if(kind!=='loading'&&kind!=='playback')return false;
      // Loading prevalece: após falha inicial ou reload parcial deve reabrir
      // a mídia por meio do fluxo que também aplica checkpoint.
      if(pending==='loading')return true;
      pending=kind;
      epoch++;
      return true;
    }
    function take(){
      const kind=pending;
      pending=null;
      return kind;
    }
    function clear(){pending=null;epoch++}
    function status(){return {pending,armed:!!pending,epoch}}
    return Object.freeze({arm,take,clear,status});
  }
  root.JOGAHUB_PLAYER_DRIVE_RECONNECT=Object.freeze({makeGate});
})(window);
