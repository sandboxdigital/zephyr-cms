@extends('zephyr::layouts.admin-nav-left')

@section('content')
    <div class="content-title">
        <div class="row">
            <div class="col-6"><h3 class="cms">{{ $crud->tableLabel }}</h3></div>
            @if($crud->enableStore)
                <div class="col-6" style="text-align: right">
                    <a href="{{route($crud->routeName . '.create')}}" class="cms-btn">Add</a>
                </div>
            @endif
        </div>
    </div>
        @if(count($crud->filters))
            <div class="row">
                <div class="col-12">
                    <form class="form-inline" action="/admin/{{$crud->routeName}}" method="GET">
                        <div class="button-blocks my-2">
                            @foreach($crud->filters as $key => $filter)
                                {!! \App\SandboxCrud\CrudService::getFilter(
                                    $key,
                                    $filter['label'],
                                    $filter['type'],
                                    isset($crud->activeFilters[$key]) ? $crud->activeFilters[$key] :  null,
                                    $filter['option']
                                ) !!}
                            @endforeach

                            <button class="cms-btn align-bottom">Filter</button>
                        </div>
                    </form>
                </div>
            </div>
        @endif


    <table class="cms-table">
        <thead>
            <tr>
                @foreach($crud->attributes as $key => $attribute)
                    {{--<td>{{ $list->{$value} }}</td>--}}
                    @if(in_array($key, array_keys($crud->attributes)) && in_array($key, $crud->attributesList))
                        <th>{{$attribute->label}}</th>
                    @endif
                @endforeach
                <th class="controls"></th>
            </tr>
        </thead>
        <tbody>
            @foreach($lists as $list)
            <tr>
                @foreach($crud->attributes as $key => $attribute)
                    {{--<td>{{ $list->{$value} }}</td>--}}
                    @if(in_array($key, array_keys($crud->attributes)) && in_array($key, $crud->attributesList))
                        <td>{!! $attribute->value($list)->getClientValue() !!}</td>
                    @endif
                @endforeach
                <td class="controls">
                    <a href="{{route($crud->routeName . '.show', $list->id )}}" class="cms-btn-icon btn-cms-default"><i class="icon ion-md-eye"></i></a>
                @if($crud->enableUpdate)
                    <a href="{{route($crud->routeName . '.edit', $list->id )}}" class="cms-btn-icon btn-cms-default"><i class="icon ion-md-create"></i></a>
                @endif
                @if($crud->enableDelete)
                    <a class="cms-btn-icon btn-cms-default" href="#" onclick="deleteById({{$list->id}})">
                        <i class="icon ion-md-close"></i>
                    </a>
                    <form id="delete-form-{{$list->id}}" action="{{route($crud->routeName . '.destroy', $list->id)}}" method="POST">
                        @csrf
                        <input name="_method" type="hidden" value="DELETE">
                    </form>
                @endif
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    {{$lists->links()}}
@endsection

@section('footer-scripts')
    <script>
        function deleteById(id){
            event.preventDefault();
            if(confirm("Are you sure you want to delete?")){
                document.getElementById('delete-form-'+id).submit();
            }
        }
    </script>
@endsection