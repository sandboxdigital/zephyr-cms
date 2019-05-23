@extends('zephyr::layouts.admin-nav-left')

@section('content')
    <div class="content-title">
        <div class="row">
            <div class="col-6"><h3 class="cms">Permissions</h3></div>
        </div>
    </div>

    <div class="row">
        <div class="col-12">
            <cms-permissions></cms-permissions>
        </div>
    </div>
@endsection