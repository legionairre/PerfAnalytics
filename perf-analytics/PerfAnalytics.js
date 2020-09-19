window.onload = function(){
  setTimeout(function(){
    const { performance } = window;
    const performanceEntries = performance.getEntriesByType('paint');
    const performanceEntryResources = performance.getEntriesByType('resource');
    const performanceEntryNavigations = performance.getEntriesByType('navigation');
    const perfTiming = performance.timing;
    console.log('TTFB (Server response time or Time to First Byte): ', (perfTiming.responseStart - perfTiming.requestStart).toFixed(2) + "ms");
    console.log('FCP: The time to ' + performanceEntries[1].name + " was " + (performanceEntries[1].startTime).toFixed(2) + "ms");
    console.log('Dom Loading / Page Render Time: ', (perfTiming.domComplete - perfTiming.domLoading).toFixed(2) + "ms");
    console.log('Window Load / Total Page Load Time: ', (perfTiming.loadEventEnd - perfTiming.navigationStart).toFixed(2) + "ms");
    console.log('--------- Document, Image, Font, JS, and CSS StartTime and Duration --------');
    performanceEntryResources.forEach((e) => {
      console.log(e.name + ':\nStart Time: ' + e.startTime.toFixed(2) + 'ms\nDuration:  ' + e.duration.toFixed(2) + 'ms');
    });
    performanceEntryNavigations.forEach((e) => {
      console.log(e.name + ':\nStart Time: ' + e.startTime.toFixed(2) + 'ms\nDuration:  ' + e.duration.toFixed(2) + 'ms');
    });
    const ttfb = (perfTiming.responseStart - perfTiming.requestStart).toFixed(2);
    const fcp = (performanceEntries[1].startTime).toFixed(2);
    const domLoad = (perfTiming.domComplete - perfTiming.domLoading).toFixed(2);
    const windowLoad = (perfTiming.loadEventEnd - perfTiming.navigationStart).toFixed(2);
  }, 0);
}
