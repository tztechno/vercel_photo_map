function handleRequest(e) {
    console.log('Request Method: ' + e.method);
    console.log('Post Data Contents: ' + (e.postData ? e.postData.contents : 'No postData'));
    // ... 残りのコード ...
}