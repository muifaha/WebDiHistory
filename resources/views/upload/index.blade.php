@extends('common.template')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-12">

                <form id="formUpload" method="post" action="{{ route('upload') }}" enctype="multipart/form-data">

                    <div class="form-group">
                        @if (count($errors))
                        <div class="alert alert-danger">
                            <ul>
                                @foreach ($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                        @endif
                    </div>

                    @if (Session::has('flash_message'))
                        <div class="alert alert-success">
                            <span class="glyphicon glyphicon-ok"></span>
                            <em> {!! session('flash_message') !!}</em>
                        </div>
                    @endif
                    {{ csrf_field() }}

                    <div class="form-group">
                        <div class="row">
                            <div class="col">
                                <input type="text" name="name" class="form-control" placeholder="Image name" required>
                            </div>
                            <div class="col">
                                <input type="number" min="10" name="width" class="form-control" value="10" placeholder="Image width">
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="row">
                            <div class="col">
                                <label for="image">Image</label>
                                <input type="file" name="image" class="form-control-file" id="image" required>
                            </div>
                            <div class="col">
                                <input type="text" name="image_metedata" class="form-control" placeholder="Image Metadata">
                                {{--  <label for="image-metadata">Image Metadata</label>
                                <input type="file" name="image_metedata" class="form-control-file" id="image-metadata">  --}}
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <button class="btn btn-primary">
                            Upload
                        </button>
                    </div>

                </form>

            </div>
        </div>
    </div>
@endsection