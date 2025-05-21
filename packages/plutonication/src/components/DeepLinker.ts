export interface DeepLinker {
  destroy: () => void,
  openURL: (url: string) => void,
}

/**
 * Source: https://gist.github.com/diachedelic/0d60233dab3dcae3215da8a4dfdcd434
 * Deep link to a native app from a browser, with a fallback
 * @param options 
 */
export function initializeDeepLinker(
  onSuccess: () => void,
  onFailed: () => void,
): DeepLinker {
  let didHide = false;
  let didFail = false;

  // document is hidden when native app is shown or browser is backgrounded
  function onVisibilityChange(e: any) {
    if (e.target.visibilityState === 'hidden') {
      if (!(didHide || didFail)) {
        onSuccess();

        didHide = true;
      }      
    }
  };

  // add/remove event listeners
  // `mode` can be "add" or "remove"
  function bindEvents(mode: any) {
    [
      [document, 'visibilitychange', onVisibilityChange],
    ].forEach(function(conf: any) {
      conf[0][mode + 'EventListener'](conf[1], conf[2]);
    });
  }

  // add event listeners
  bindEvents('add');

  return {
    destroy: bindEvents.bind(null, 'remove'),
    openURL: (url: string) => {
      // it can take a while for the dialog to appear
      var dialogTimeout = 500;

      setTimeout(function() {
        if (!didHide) {
          didFail = true;

          onFailed();
        }
      }, dialogTimeout);

      window.location.href = url;
    }
  }
}
