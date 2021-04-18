<?php
class Request {

	private $curl = NULL;
	private $base_url = NULL;

    public function __construct($base_url) {
        if(!function_exists('curl_init')){
            echo "module curl_init not exist";
            exit;
        }
        $this->base_url = $base_url;
        $this->curl = curl_init();
    }

    public function GET($path){
        $full_url = $this->base_url . $path;
        curl_setopt_array($this->curl, array(
            CURLOPT_RETURNTRANSFER => 1,
            CURLOPT_URL => $full_url,
            CURLOPT_USERAGENT => 'Curl'
        ));
        $resp = curl_exec($this->curl);
        curl_close($this->curl);
		return $resp;
    }
}
?>