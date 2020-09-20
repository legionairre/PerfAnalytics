const HEADERS = {'Content-Type': 'application/json'}
const POST = 'POST';
const API_URL = 'http://localhost:5000';

window.onload = function(){
  setTimeout(function(){
    const { performance } = window;
    const perfTiming = performance.timing;
    const performanceEntries = performance.getEntriesByType('paint');
    const performanceEntryResources = performance.getEntriesByType('resource');
    const performanceEntryNavigations = performance.getEntriesByType('navigation');

    const ttfbVal = (perfTiming.responseStart - perfTiming.requestStart).toFixed(2);
    const fcpVal = (performanceEntries[1].startTime).toFixed(2);
    const domLoadVal = (perfTiming.domComplete - perfTiming.domLoading).toFixed(2);
    const windowLoadVal = (perfTiming.loadEventEnd - perfTiming.navigationStart).toFixed(2);

    let body = [
      {
        url: window.location.href,
        analyticType: 'TTFB',
        time: ttfbVal
      },
      {
        url: window.location.href,
        analyticType: 'FCP',
        time: fcpVal
      },
      {
        url: window.location.href,
        analyticType: 'DOM_LOAD',
        time: domLoadVal
      },
      {
        url: window.location.href,
        analyticType: 'WINDOW_LOAD',
        time: windowLoadVal
      }
    ];

    console.log('TTFB (Server response time or Time to First Byte): ', (perfTiming.responseStart - perfTiming.requestStart).toFixed(2) + "ms");
    console.log('FCP: The time to ' + performanceEntries[1].name + " was " + (performanceEntries[1].startTime).toFixed(2) + "ms");
    console.log('Dom Loading / Page Render Time: ', (perfTiming.domComplete - perfTiming.domLoading).toFixed(2) + "ms");
    console.log('Window Load / Total Page Load Time: ', (perfTiming.loadEventEnd - perfTiming.navigationStart).toFixed(2) + "ms");
    console.log('--------- Document, Image, Font, JS, and CSS StartTime and Duration --------');
    performanceEntryResources.forEach((e) => {
      body.push({
        url: e.name,
        analyticType: e.initiatorType,
        time: e.duration.toFixed(2),
        startTime: e.startTime.toFixed(2)
      })
      console.log(e.name + ':\nStart Time: ' + e.startTime.toFixed(2) + 'ms\nDuration:  ' + e.duration.toFixed(2) + 'ms');
    });
    performanceEntryNavigations.forEach((e) => {
      body.push({
        url: e.name,
        analyticType: e.initiatorType,
        time: e.duration.toFixed(2),
        startTime: e.startTime.toFixed(2)
      })
      console.log(e.name + ':\nStart Time: ' + e.startTime.toFixed(2) + 'ms\nDuration:  ' + e.duration.toFixed(2) + 'ms');
    });

    fetch(API_URL, {
      method: POST,
      headers: HEADERS,
      body: JSON.stringify(body),
    })

  }, 0);
}
