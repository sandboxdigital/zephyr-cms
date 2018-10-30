@extends('zephyr::layouts.admin-nav-left')

@section('content')
    <div class="row">
        <div class="col-12">
            <h2>{{ $crud->tableLabel }}</h2>

            <div class="container">

                @foreach($crud->attributes as $key => $attribute)
                    <div class="row">
                        <div class="col">
                            <strong >{{ $attribute->label  }}</strong>
                        </div>
                        <div class="col text-left">
                            <p>{{  $attribute->value($model)->getClientValue() }}</p>
                        </div>
                    </div>
                    <hr class="my-2">
                @endforeach

            </div>
        </div>
    </div>
    <div class="container-md">
        @includeIf($crud->customShowLowerView)
    </div>
@endsection
