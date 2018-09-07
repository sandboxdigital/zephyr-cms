@extends('zephyr::layouts.admin-nav-left', ['page' => 'cms-menus'])

@section('content')
    <div class="content-title">
        <h3 class="cms">Menus</h3>
    </div>
    <div id="cms">
        <cms-page-menus></cms-page-menus>
    </div>
@endsection