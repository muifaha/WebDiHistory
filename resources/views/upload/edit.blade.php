@extends('common.template')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-12">

                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Target ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Width</th>
                            <th scope="col">Active Flag</th>
                            <th scope="col">Tracking Rating</th>
                            <th scope="col">Reco Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{{ $data->target_id }}</td>
                            <td>{{ $data->name }}</a></td>
                            <td>{{ $data->width }}</a></td>
                            <td>{{ $data->active_flag }}</a></td>
                            <td>{{ $data->tracking_rating }}</a></td>
                            <td>{{ $data->reco_rating }}</a></td>
                        </tr>
                    </tbody>
                </table>

                <form id="formUpload" method="post" action="{{ route('getUpdate', $id) }}" enctype="multipart/form-data">

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
                                <input type="text" name="name" class="form-control" placeholder="Image name" required value="{{ $data->name }}">
                            </div>
                            <div class="col">
                                <input type="number" min="10" name="width" class="form-control" value="{{ $data->width }}" placeholder="Image width">
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="row">
                            <div class="col">
                                <label for="image">Image</label>
                                <input type="file" name="image" class="form-control-file" id="image">
                            </div>
                            <div class="col">
                                <input type="text" name="image_metedata" class="form-control" placeholder="Image Metadata">
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