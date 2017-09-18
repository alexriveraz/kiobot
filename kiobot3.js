// Conexion a la libreria de botkit.js
var Botkit = require('/home/ubuntu/node_modules/botkit/lib/Botkit.js');

// Se valida el token ID

if (!process.env.token) {
  console.log('Error: Token ID incorrecto!!!');
  process.exit(1);
}

var controller = Botkit.slackbot({
 debug: false
});

controller.spawn({
  token: process.env.token
}).startRTM(function(err) {
  if (err) {
    throw new Error(err);
  }
});

/************    Comienzan instrucciones para infra de Tribunal ************/

/************    Ceph Fenix ************/

var fenixPrivateIP="10.62.98.20";
var fenixPublicIP="201.175.27.20";
var fenixIP=fenixPublicIP;

controller.hears(['fenix ceph'], 'direct_message,direct_mention',  function(bot, message) {
    const exec = require('child_process').exec;
    const child = exec('ssh kftadmin@'+fenixIP+' -p65535 "sudo ceph -s"',
                  (error, stdout, stderr) => {
                      var ceph_output = stdout;
                      bot.reply(message, '```'+ceph_output+'```');
                      console.log('stderr: ${stderr}');
                  });
    ceph_output = "";

});

/************    VNC  Fenix ************/

controller.hears('fenix novnc (.*)', 'direct_message,direct_mention,mention', function(bot, message) {
    var name_instance = message.match[1];

    const exec = require('child_process').exec;
    var command = 'ssh kftadmin@'+fenixIP+' -p65535 "sudo -i bash -ic novnc '+name_instance+' 2>/dev/null"';
    const child = exec(command,
                  (error, stdout, stderr) => {
                      var output = stdout;
                      bot.reply(message, '```'+output+'```');
                      console.log('stderr: ${stderr}');
                  });
});

/************    Get Name  Fenix ************/

controller.hears('fenix get name (.*)', 'direct_message,direct_mention,mention', function(bot, message) {
	var ip_instance = message.match[1];
	const exec = require('child_process').exec;
	var command = 'ssh kftadmin@'+fenixIP+' -p65535 "sudo -i bash -ic getNamebyIP '+ip_instance+' 2>/dev/null"';
    const child = exec(command,
                  (error, stdout, stderr) => {
                      var output = stdout;
                      if (output) {
                          bot.reply(message, '```'+output+'```');
                      } else {
                          bot.reply(message, ':( no pude encontrar alguna instancia con esa IP');
                      }
                      console.log('stderr: ${stderr}');
                  });
});

/************    Get ID  Fenix ************/

controller.hears('fenix get id (.*)', 'direct_message,direct_mention,mention', function(bot, message) {
	var ip_instance = message.match[1];
	const exec = require('child_process').exec;
	var command = 'ssh kftadmin@'+fenixIP+' -p65535 "sudo -i bash -ic getIDbyIP '+ip_instance+' 2>/dev/null"';
    const child = exec(command,
                  (error, stdout, stderr) => {
                      var output = stdout;
                      if (output) {
                          bot.reply(message, '```'+output+'```');
                      } else {
                          bot.reply(message, ':( no pude encontrar alguna instancia con esa IP');
                      }
                      console.log('stderr: ${stderr}');
                  });
});

/************    Nova service-list  Fenix ************/

controller.hears('fenix nova service-list', 'direct_message,direct_mention,mention', function(bot, message) {
    const exec = require('child_process').exec;
    var command = 'ssh kftadmin@'+fenixIP+' -p65535 "sudo -i bash -ic nova_service_list 2>/dev/null"';
    const child = exec(command,
                  (error, stdout, stderr) => {
                      var output = stdout;
                      if (output) {
                          bot.reply(message, '```'+output+'```');
                      } else {
                          bot.reply(message, 'No pude obtener respuesta');
                      }
                      console.log('stderr: ${stderr}');
                  });
});

/************    Infrastructure Capacity  Fenix ************/

controller.hears('fenix infracapacity', 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, 'Generando correo con información ... espera');
    const exec = require('child_process').exec;
    var command = 'ssh kftadmin@'+fenixIP+' -p65535 "sudo -i bash -ic /root/infrastructureCapacity.sh 2>/dev/null"';
    const child = exec(command,
                  (error, stdout, stderr) => {
                      var output = stdout;
                      if (output) {
                          bot.reply(message, 'Correo enviado.');
                      } else {
                          bot.reply(message, 'No pude obtener respuesta');
                      }
                      console.log('stderr: ${stderr}');
                  });
});

/************    Terminan instrucciones para infra de Tribunal ************/

/************    Comienzan instrucciones para infra de GOBMX ************/

/************    Nova service-list  GOBMX ************/

controller.hears('jordan nova service-list', 'direct_message,direct_mention,mention', function(bot, message) {
    const exec = require('child_process').exec;
    var command = 'ssh kftadmin@10.52.30.10 -p65535 "sudo -i bash -ic nova_service_list 2>/dev/null"';
    const child = exec(command,
                  (error, stdout, stderr) => {
                      var output = stdout;
                      if (output) {
                          bot.reply(message, '```'+output+'```');
                      } else {
                          bot.reply(message, 'No pude obtener respuesta');
                      }
                      console.log('stderr: ${stderr}');
                  });
});

/************    Protocolo de incidencias  GOBMX ************/

controller.hears(['jordan graficas', 'jordan gráficas'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, 'Generando gráficas ... espera');
    const exec = require('child_process').exec;
    var command = "ssh kftadmin@10.52.30.11 -p65535 \"/usr/local/bin/generate_zabbix_graphs_day.sh\" 2>/dev/null";
    //var command = "ssh kftadmin@201.175.22.16 -p65535 \"/usr/local/bin/wrapper_jordan_graphs.sh\" 2>/dev/null";
    const child = exec(command,
                  (error, stdout, stderr) => {
                      var output = stdout;
                      if (output) {
                          bot.reply(message, 'Gráficas generadas!');
                      } else {
                          bot.reply(message, 'No pude obtener respuesta');
                      }
                      console.log('stderr: ${stderr}');
                  });
});

/************    Terminan instrucciones para infra de GOBMX ************/

/************    Instrucciones para Menu de ayuda ************/

controller.hears(['help', 'ayuda'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.api.users.info({user: message.user}, (error, response) => {
        let {name, real_name} = response.user;
		var help = 'Hola @'+name+', estos son los comandos que puedo recibir:\n\n';
        help += 'Actualmente sólo estoy trabajando con la infraestructura de *TSJCDMX* (fenix)\n\n\n';
        help += '*Ya puedo generar las gráficas del Protocolo de Incidencias de GOB.MX!*\n\n\n';
    	help += '*Obtener URL de novnc*: `<infraestructura> novnc <nombre instancia>`\n';
    	help += 'ejemplo: `fenix novnc TEST_KPP`\n\n\n';
        help += '*Obtener el estatus de Ceph*: `<infraestructura> ceph`\n';
    	help += 'Para Tribunal también hay un `fenix cephkpp` _(Cluster 2 de Ceph)_\n\n\n';
        help += '*Obtener el nombre de la instancia a partir de la IP*: `<infraestructura> get name <IP>`\n';
        help += 'ejemplo: `fenix get name 10.10.21.36`\n\n\n';
        help += '*nova service-list*: `<infraestructura> nova service-list`\n\n\n';
        help += '*Obtener el ID de la instancia a partir de la IP*: `<infraestructura> get id <IP>`\n';
        help += 'ejemplo: `fenix get id 10.10.21.36`\n\n\n';
        help += '*Obtener gráficas del protocolo de incidencias:* `jordan gráficas`\n\n\n';
        help += '*Generar reporte de capacidad de infraestructura:* `<infraestructura> infracapacity`\n\n\n';
        help += '*Para listar las infraestructuras disponibles: *`infraestructuras`\n\n\n';
    bot.reply(message, help);
	})
});

/***********  HELP Koolfit ***********/
controller.hears(['Koolfit', 'koolfit'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.api.users.info({user: message.user}, (error, response) => {
        let {name, real_name} = response.user;
    var help = 'Hola @'+name+', \n'
        help += 'Servicio: *Koolfit*\n';
        help += 'Estos son los comandos que puedo recibir:\n\n';
        help += 'Actualmente sólo estoy trabajando con la infraestructura de *TSJCDMX* (fenix)\n\n\n';
        help += '*Ya puedo generar las gráficas del Protocolo de Incidencias de GOB.MX!*\n\n\n';
      help += '*Obtener URL de novnc*: `<infraestructura> novnc <nombre instancia>`\n';
      help += 'ejemplo: `fenix novnc TEST_KPP`\n\n\n';
        help += '*Obtener el estatus de Ceph*: `<infraestructura> ceph`\n';
      help += 'Para Tribunal también hay un `fenix cephkpp` _(Cluster 2 de Ceph)_\n\n\n';
        help += '*Obtener el nombre de la instancia a partir de la IP*: `<infraestructura> get name <IP>`\n';
        help += 'ejemplo: `fenix get name 10.10.21.36`\n\n\n';
        help += '*nova service-list*: `<infraestructura> nova service-list`\n\n\n';
        help += '*Obtener el ID de la instancia a partir de la IP*: `<infraestructura> get id <IP>`\n';
        help += 'ejemplo: `fenix get id 10.10.21.36`\n\n\n';
        help += '*Obtener gráficas del protocolo de incidencias:* `jordan gráficas`\n\n\n';
        help += '*Generar reporte de capacidad de infraestructura:* `<infraestructura> infracapacity`\n\n\n';
    bot.reply(message, help);
  })
});

/***********  Infraestructuras ***********/
controller.hears(['infraestructura', 'infraestructuras', 'Infraestructura', 'Infraestructuras'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.api.users.info({user: message.user}, (error, response) => {
        let {name, real_name} = response.user;
    var help = 'Infraestructuras disponibles: \n'
        help += '`fenix` = *TSJCDMX*\n';
        help += '`jordan` = *GobMX*\n';
        help += '`bessel` = *SFE Multitenant*\n';
        help += '`andromeda` = *IMSS*\n';
        help += '`gemma` = *ENEL*\n';
        help += '`earth` = *SportsWorld*\n';
        help += '`izar` = *Excelsior*\n';
        help += '`draco` = *Soriana*\n';

    bot.reply(message, help);
  })
});

/***********  image test ***********/
controller.hears(['hi', 'hello'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.api.users.info({user: message.user}, (error, response) => {
        let {name, real_name} = response.user;
    var help = 'Hi @'+name+', \n'
    	help += '{\n    		"attachments": [\n        		{\n         		   "fallback": "Network traffic (kb/s): How does this look? @slack-ops - Sent by Julie Dodd - https://datadog.com/path/to/event",\n        		    "title": "Network traffic (kb/s)",\n        		    "title_link": "https://datadog.com/path/to/event",\n        		    "text": "How does this look? @slack-ops - Sent by Julie Dodd",\n        		    "image_url": "https://datadoghq.com/snapshot/path/to/snapshot.png",\n        		    "color": "#764FA5"\n        		}\n    		]\n		}';
    bot.reply(message, help);
  })
});

/***********  Saludos ***********/
controller.hears(['Hola','hola'], 'ambient', function(bot, message) {
    var hi_messages = ['hola',
                       'buen día',
                       'cómo estás?',
                       'que onda',
                       'Hola'];
    var randMessage = hi_messages[Math.floor(Math.random() * hi_messages.length)];
    bot.reply(message, randMessage);
});

/***********  Fecha ***********/

controller.hears('date', 'direct_message,direct_mention,mention', function(bot, message) {
    var d = new Date();
    date = d.toDateString();
    //bot.reply(message, 'The date is '+date+'.');
    bot.api.users.info({user: message.user}, (error, response) => {
        let {name, real_name} = response.user;
        //console.log(name, real_name);
        bot.reply(message, "@"+name+" the date is "+date);
    })
});