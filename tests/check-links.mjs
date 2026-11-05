const urls = [
 'https://github.com/medinafdzz',
 'https://linkedin.com/in/medinafdzz',
 'https://github.com/medinafdzz/CodeGuardian',
 'https://github.com/medinafdzz/commons-dbutils',
 'https://github.com/medinafdzz/RemoteWordle',
 'https://github.com/medinafdzz/QR-generator',
 'https://github.com/medinafdzz/cleaningrobotpy',
 'https://github.com/medinafdzz/Password-manager',
];
const results = await Promise.all(urls.map(async url => {
 try { const response=await fetch(url,{method:'HEAD',redirect:'follow',signal:AbortSignal.timeout(20000)});return {url,status:response.status,finalUrl:response.url}; }
 catch(error){return {url,error:error.message};}
}));
console.log(JSON.stringify(results,null,2));
