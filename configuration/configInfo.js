let configInfo = {"tjname":"Michael","gender":"male","language_tts":"en-US","language_stt":"en-US","voice":"en-US_MichaelVoice"}; 
configInfo = JSON.stringify(configInfo, null); 
configInfo = JSON.parse(configInfo); 
exports.configInfo = configInfo; 
