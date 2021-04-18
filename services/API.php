<?php
require_once("request.php");
require_once("rest.php");
require_once("conf.php");

class API extends REST {

	private $request = NULL;
	private $conf = NULL;

	public function __construct(){
		parent::__construct();
        $this->conf = new CONF();
        $this->request = new Request($this->conf->BASE_URL);
	}

	private function info(){
        echo "Services connected";
	}

    private function getCategories(){
		if($this->get_request_method() != "GET") $this->response('',406);
        $resp = $this->request->GET("app/services/getCategories");
        $this->response($resp, 200);
    }

    private function getPlaces(){
		if($this->get_request_method() != "GET") $this->response('',406);
		$param = "";
        if(isset($this->_request['cat_id'])) $param = $this->_request['cat_id'];
        if($param != "" && $param != -1){
            $path = "app/services/getPlaces?cat_id=".$param;
        }else{
            $path = "app/services/getPlaces";
        }
        $q = (isset($this->_request['q'])) ? ($this->_request['q']) : "";
        $path = $path.'&q='.$q;
        $resp = $this->request->GET($path);
        $this->response($resp, 200);
    }

    private function getPlaceCount(){
        if($this->get_request_method() != "GET") $this->response('',406);

        $cat_id = (isset($this->_request['cat_id'])) ? $this->_request['cat_id'] : "" ;
        $q = (isset($this->_request['q'])) ? ($this->_request['q']) : "";
        $path = "app/services/getPlaceCount?";
        if($cat_id != "" && $cat_id != -1){
            $path = $path."&cat_id=".$cat_id;
        }
        if($q != "") $path = $path.'&q='.$q;
        $resp = $this->request->GET($path);
        $this->response($resp, 200);
    }

    private function getPlacesByPage(){
        if($this->get_request_method() != "GET") $this->response('',406);

        $limit = (isset($this->_request['limit'])) ? (int)$this->_request['limit'] : 10;
        $offset = (isset($this->_request['page'])) ? ((int)$this->_request['page']) : 1;
        $cat_id = (isset($this->_request['cat_id'])) ? $this->_request['cat_id'] : "" ;
        $q = (isset($this->_request['q'])) ? ($this->_request['q']) : "";
        $path = "app/services/getPlacesByPage?";
        if($cat_id != "" && $cat_id != -1){
            $path = $path."&cat_id=".$cat_id;
        }
        if($q != "") $path = $path.'&q='.$q;
        $path = $path.'&limit='.$limit;
        $path = $path.'&page='.$offset;
        $resp = $this->request->GET($path);
        $this->response($resp, 200);
    }

    private function getNewsCount(){
        if($this->get_request_method() != "GET") $this->response('',406);
        $path = "app/services/getNewsInfoCount";
        $resp = $this->request->GET($path);
        $this->response($resp, 200);
    }

    private function getNewsByPage(){
        if($this->get_request_method() != "GET") $this->response('',406);

        $limit = (isset($this->_request['limit'])) ? (int)$this->_request['limit'] : 10;
        $offset = (isset($this->_request['page'])) ? ((int)$this->_request['page']) : 1;
        $path = "app/services/getNewsInfoByPage?";
        $path = $path.'limit='.$limit;
        $path = $path.'&page='.$offset;
        $resp = $this->request->GET($path);
        $this->response($resp, 200);
    }

    private function getImagesByPlaceId(){
		if($this->get_request_method() != "GET") $this->response('',406);
        if(!isset($this->_request['place_id'])) {
            echo "Invalid params";
            exit;
        }
        $param = $this->_request['place_id'];
        $path = "app/services/imagesByPlaceId?place_id=".$param;
        $resp = $this->request->GET($path);
        $this->response($resp, 200);
    }

    private function getImagePath(){
        if($this->get_request_method() != "GET") $this->response('',406);
        $resp = $this->conf->BASE_URL . 'uploads/place/';
        echo $resp;
        exit;
    }

    private function getNewsImagePath(){
        if($this->get_request_method() != "GET") $this->response('',406);
        $resp = $this->conf->BASE_URL . 'uploads/news/';
        echo $resp;
        exit;
    }

	/* Dynamically call the method based on the query string
	 * Handling direct path to function
	 */
	public function processApi(){
		if(isset($_REQUEST['x']) && $_REQUEST['x']!=""){
			$func = strtolower(trim(str_replace("/","", $_REQUEST['x'])));
			if((int)method_exists($this,$func) > 0) {
				$this->$func();
			} else {
				echo 'processApi - method not exist';
				exit;
			}
		} else {
			echo 'processApi - method not exist';
			exit;
		}
	}
	
}

// Initiate Library
$api = new API;
$api->processApi();
?>
