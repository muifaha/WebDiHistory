@extends('common.template')

@section('content')
    <div class="container">
        <div class="row">
            <div class="col-md-12">

                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Target ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Width</th>
                            <th scope="col">Active Flag</th>
                            <th scope="col">Tracking Rating</th>
                            <th scope="col">Reco Rating</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($data as $key => $item)
                            <tr>
                                <th scope="row">{{ $key + 1 }}</th>
                                <td><a href="{{ route('getData', $item->target_id) }}">{{ $item->target_id }}</a></td>
                                <td>{{ $item->name }}</a></td>
                                <td>{{ $item->width }}</a></td>
                                <td>{{ $item->active_flag }}</a></td>
                                <td>{{ $item->tracking_rating }}</a></td>
                                <td>{{ $item->reco_rating }}</a></td>
                                <td><a href="{{ route('getDelete', $item->target_id) }}" title="delete" data-method="DELETE" class="delete-btn"><i class="fa fa-trash-o" aria-hidden="true"></i></a></a></td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>

            </div>
        </div>
    </div>
@endsection
@section('footerJS')
    <script type="text/javascript">
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        $(document).on('click', '.delete-btn', function(e) {
            var $this = $(this);

            if (confirm('Are you sure you want to delete this post?')) {
                $.post({
                    type: $this.data('method'),
                    url: $this.attr('href')
                }).done(function (data) {
                    $this.parents('tr').remove();
                    console.log(data);
                }).fail(function (data) {
                    console.log(data);  
                });
            }

            e.preventDefault();
        });
    </script>
@endsection