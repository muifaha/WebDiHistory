<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
// use Panoscape\Vuforia\VuforiaWebService as VWS;
use \Panoscape\Vuforia\Target as Target;
// use \Panoscape\Vuforia\VuforiaWebService as VWS;
use \Panoscape\Vuforia\Facades\VuforiaWebService as VWS;

class UploadController extends Controller
{
    private $config;

    function __construct()
    {
        // $result = $vws->getTargets();
        $this->config =  [
            "url" => [
                "targets" => "https://vws.vuforia.com/targets",
                "duplicates" => "https://vws.vuforia.com/duplicates",
                "summary" => "https://vws.vuforia.com/summary",
            ],
            "credentials" => [
                "access_key" => "570855399f9459d47858aa60f3c8185af363a5a2",
                "secret_key" => "a503064a7f2bfff2b9038cbd141ae11bf9fa951f",
            ],
            "max_image_size" => 2097152,
            "max_meta_size" => 2097152,
            "naming_rule" => "/^[\w\-]+$/",
        ];
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('upload.index');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $data = [];
        $vws = VWS::create($this->config);
        $results = $vws->getTargets();

        if ($results['status'] == 201) {
            $body = json_decode($results['body']);
            $cloudId = $body->target_id;
        } else {
            $body = json_decode($results['body']);

            foreach ($body->results as $key => $item) {
                $getTarget = $vws->getTarget($item);
                $result = json_decode($getTarget['body']);
                $data[$key] = $result->target_record;
            }
        }
        // dd($result);
        // dd($body);

        return view('upload.list', compact('data'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate(
            request(), [
                'name' => 'required|string|max:255|regex:/^\S*$/u',
                'width' => 'numeric|min:10',
                'image' => 'required'
            ]
        );

        $photo = $request->image;
        
        if ($photo) {
            $filename = $photo->store('image');
            $photo->move(public_path("/uploads/image"), $filename);
            $uploadedImage = "http://" . $_SERVER['SERVER_NAME'] . ":8000/uploads/" . $filename;
            
            $add = VWS::addTarget([
                'name' => $request->name, 
                'width' => floatval($request->width), 
                'path' => public_path('uploads/' . $filename),
                'metadata' => $request->image_metedata
            ]);
        } else {
            $add = VWS::addTarget([
                'name' => $request->name, 
                'width' => floatval($request->width), 
                'metadata' => $request->image_metedata
            ]);
        }
        // dd($add);

        if ($add['status'] == '201') {
            \Session::flash('flash_message', $request->name . ' was successfully Created.');

            return redirect()->back();
        } else {
            $error = json_decode($add['body']);
            if ($error->result_code === "TargetNameExist") {
                $errorMsg = "Target Name already exist";
            } else {
                $errorMsg = $error->result_code;
            }
            
            return redirect()->back()->withErrors([ $errorMsg ]);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $vws = VWS::create($this->config);
        $getData = $vws->getTarget($id);
        $dataInfo = json_decode($getData['body']);
        $data = $dataInfo->target_record;

        return view('upload.edit', compact([
                'id',
                'data'
            ]
        ));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->validate(
            request(), [
                'name' => 'required|string|max:255|regex:/^\S*$/u',
                'width' => 'numeric|min:10'
            ]
        );

        $photo = $request->image;

        if ($photo) {
            $filename = $photo->store('image');
            $photo->move(public_path("/uploads/image"), $filename);
            $uploadedImage = "http://" . $_SERVER['SERVER_NAME'] . ":8000/uploads/" . $filename;
            
            $update = VWS::updateTarget($id, [
                'name' => $request->name, 
                'width' => floatval($request->width), 
                'path' => public_path('uploads/' . $filename),
                'metadata' => $request->image_metedata
            ]);
        } else {
            $update = VWS::updateTarget($id, [
                'name' => $request->name, 
                'width' => floatval($request->width), 
                'metadata' => $request->image_metedata
            ]);
        }
        // dd($update);

        if ($update['status'] == '201' || $update['status'] == '200') {
            \Session::flash('flash_message', $request->name . ' was successfully Created.');

            return redirect()->back();
        } else {
            $error = json_decode($update['body']);
            if ($error->result_code === "TargetNameExist") {
                $errorMsg = "Target Name already exist";
            } else {
                $errorMsg = $error->result_code;
            }
            
            return redirect()->back()->withErrors([ $errorMsg ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $delete = VWS::deleteTarget($id);
        // dd($delete);

        return response()->json(['success' => 'Image ID: has been deleted']);
    }
}
