@extends('zephyr::layouts.admin-nav-left')

@section('content')
    <div class="row">
        <div class="col-12">
            <div class="content-title">
                <h3 class="cms">{{ $crud->tableLabel }}</h3>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-8">

            <div class="cms-form">
                <form action="{{ route($crud->routeName . '.store') }}" method="POST" @if($crud->enableFileUploads)  enctype="multipart/form-data" @endif>
                    <input type="hidden" name="_token" value="{{ csrf_token() }}">
                        @foreach($crud->attributes as $key => $attribute)
                            @if(in_array($key, array_keys($crud->attributes)) && in_array($key, $crud->attributesCreate))
                                <div class="cms-row">
                                    @if($attribute->label)<div class="cms-label"><label>{{ $attribute->label }}</label></div>@endif
                                   <div class="cms-field">
                                       {!! $attribute->renderField() !!}
                                       @if ($errors->has(str_replace('.', '_',$attribute->name))) <strong class="text-danger small-text">{{ $errors->first(str_replace('.', '_',$attribute->name))}}</strong> @endif
                                   </div>
                                </div>
                            @endif
                        @endforeach
                    <input type="submit" name="submit" class="btn bg-primary">
                </form>
            </div>
        </div>
    </div>
@endsection
