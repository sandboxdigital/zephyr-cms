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
    <div id="app">
        @include('zephyr::partials.navbar')

        <main>
            @yield('content')
        </main>
    </div>

    {!! \Sandbox\Cms\CmsHelper::js() !!}
</body>
</html>
