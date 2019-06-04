@extends('zephyr::layouts.admin-nav-left')

@section('content')
    <div class="content-title">
        <div class="row">
            <div class="col-6"><h3 class="cms">File Manager</h3></div>
        </div>
    </div>

    <div class="row">
        <div class="col-12">
            <file-manager :dz-option="{maxFilesize: {{ config('zephyr.file.max_upload_size')  }}}"></file-manager>
        </div>
    </div>
@endsection