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
                @if($errors->any())
                    <strong class="text-danger d-block mb-2">There are some errors</strong>
                @endif
                @includeIf($crud->customEditHeadView )
                <form action="{{ route($crud->routeName . '.update', $model->id) }}" method="POST" @if($crud->enableFileUploads)  enctype="multipart/form-data" @endif novalidate>
                    <input type="hidden" name="_method" value="PUT">
                    <input type="hidden" name="_token" value="{{ csrf_token() }}">
                    @foreach($crud->attributes as $key => $attribute)
                        <div class="cms-row">
                            <?php $attr = $crud->getAttribute($key); ?>
                            @if($attr->label)<div class="cms-label"><label>{{ $attr->label }}</label></div>@endif
                            <div class="cms-field">
                                {!! $attr->value($model, old($attr->name))->renderField() !!}
                                @if ($errors->has(str_replace('.', '_',$attr->name))) <strong class="text-danger small-text">{{ $errors->first(str_replace('.', '_',$attr->name))}}</strong> @endif
                            </div>
                        </div>
                    @endforeach
                    <div class="cms-row cms-row-buttons">
                        <input type="submit" name="submit" class="cms-btn">
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection
