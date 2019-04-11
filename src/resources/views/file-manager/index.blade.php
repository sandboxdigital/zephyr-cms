@extends('zephyr::layouts.admin-nav-left')

@section('content')
    <div class="content-title">
        <div class="row">
            <div class="col-6"><h3 class="cms">File Manager</h3></div>
        </div>
    </div>

    <div class="row">
        <div class="col-12">
            <file-manager></file-manager>
        </div>
    </div>
@endsection