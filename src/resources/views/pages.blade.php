@extends('zephyr::layouts.admin-nav-left', ['page' => 'cms-pages'])

@section('content')
    <div id="cms">
        <div class="content-title">
            <h3 class="cms">Pages</h3>
        </div>
        <cms-page-pages></cms-page-pages>
    </div>
@endsection