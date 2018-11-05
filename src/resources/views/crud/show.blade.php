@extends('zephyr::layouts.admin-nav-left')

@section('content')
    <div class="row">
        <div class="col-12">
            <h2>{{ $crud->tableLabel }}</h2>

            <div class="container">
            <div class="bg-white p-3">
                <table class="table table-bordered">
                    <thead>
                        <tr class="bg-light">
                            <th>Key</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($crud->attributes as $key => $attribute)
                        <tr>
                            <td>{{ $attribute->label  }}</td>
                            <td>{{$attribute->value($model)->getClientValue()}}</td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
            </div>
        </div>
    </div>
    <div class="container-md">
        @includeIf($crud->customShowLowerView)
    </div>
@endsection
