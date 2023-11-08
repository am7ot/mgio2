const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '!'; // Replace with your bot's prefix

client.on('message', (message) => {
  if (message.content === `${prefix}help` || message.content === `${prefix}مساعدة`) {
    const helpEmbed = new Discord.MessageEmbed()
      .setTitle('قائمة الأوامر\n🎶')
      .addField('`Play` [p]', 'لتشغيل الأغنية او اضافتها للقائمة')
      .addField('`Pause`', 'إيقاف مؤقت للأغاني')
      .addField('`Resume`', 'لاكمال تشغيل الأغاني')
      .addField('`Stop` [s]', 'لإيقاف الأغاني بشكل كامل')
      .addField('`Skip`', 'لتخطي الأغنية الحالية')
      .addField('`Forward`', 'لتشغيل الأغنية عند وقت معين (بالثواني)')
      .addField('`Autoplay`', 'لتفعيل التشغيل التلقائي')
      .addField('`Repeat`', 'لتفعيل تكرار الأغنية')
      .addField('`Nowplaying` [np]', 'لعرض ما يتم تشغيله الآن')
      .addField('`Queue`', 'لعرض قائمة التشغيل')
      .addField('`Volume` [vol]', 'لتغيير مستوى الصوت')
      .addField('`Help`', 'لعرض قائمة الأوامر')
      .addField('\n🛡 قائمة الأوامر الإدارية', '\n`Setname` : لتغيير اسم البوت\n`Setavatar` : لتغيير صورة البوت')
      .setColor('#0099ff');

    message.channel.send(helpEmbed);
  }
});

client.login('YOUR_BOT_TOKEN'); // Replace with your bot's token
