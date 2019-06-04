<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Scripts -->
    <!-- Fonts -->
    <link rel="dns-prefetch" href="https://fonts.gstatic.com">

    <!-- Styles -->
    {!! \Sandbox\Cms\CmsHelper::css() !!}
</head>
<body class="zephyr-theme-light">
    <div id="cms">
        @include('zephyr::partials.navbar')

        <main>
            <div class="container">
                <div class="row">
                    <div class="col-md-2">
                        <div class="card">
                        @php
                        $adminHome = \Sandbox\Cms\Site\Site::findPage('/','admin');
                        @endphp
                        <ul class="nav nav-pills flex-column">
                            @foreach($adminHome->children as $childPage)
                                <li class="nav-item"><a class="nav-link" href="{{'/' . $adminHome->path . '/' . $childPage->path}}">{{$childPage->name}}</a></li>
                            @endforeach
                        </ul>
                        </div>
                    </div>
                    <div class="col-md-10">
                        @yield('content')
                    </div>
                </div>
            </div>
        </main>
    </div>
    <script src="https://maps.googleapis.com/maps/api/js?key={{config('zephyr.google_map.api_key')}}&libraries=places" ></script>
    {!! \Sandbox\Cms\CmsHelper::js() !!}
    @yield('footer-scripts')
</body>
</html>
