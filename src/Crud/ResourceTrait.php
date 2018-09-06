<?php

namespace Sandbox\Cms\Crud;

use Illuminate\Http\Request;

trait ResourceTrait
{

    /**
     * @var \Sandbox\Cms\Crud\Crud $crud
     */
    public $crud;

    private $views = [
        'show' => 'admin.crud.show',
        'list' => 'admin.crud.list',
        'create' => 'admin.crud.create',
        'edit' => 'admin.crud.edit',
    ];

    public function setCrud($model)
    {
        $this->crud = new Crud($model);
    }

    public function setView($viewName, $viewFile)
    {
        $this->views[$viewName] = $viewFile;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $crud = $this->crud;
        $crud->activeFilters = request()->all();

        return view($this->views['list'], compact('crud'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        if(!$this->crud->enableStore){
            return redirect()->back();
        }
        $crud = $this->crud;
        return view($this->views['create'], compact('crud'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            $data = $request;
            $data = $this->customData($data);
            $data = $this->customizeData($data);
            $this->crud->storeModel($data);

            return redirect()->back()->with('success', $this->crud->tableLabel . ' successfully added.');
        } catch (\Exception $e){
//            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $crud = $this->crud;
        $model = $this->crud->getModelInstance($id);

        return view($this->views['show'], compact('crud', 'model'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $crud = $this->crud;
        $model = $this->crud->getModelInstance($id);

        return view($this->views['edit'], compact('crud', 'model'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
//        try {
            $data = $request;
            $data = $this->customData($data);
            $data = $this->customizeData($data);


            $this->crud->updateModel($id, $data);

            return redirect()->back()->with('success', $this->crud->tableLabel . ' successfully updated.');
//        } catch (\Exception $e){
//            return redirect()->back()->with('error', $e->getMessage());
//        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $this->crud->destroyModel($id);
            return redirect()->back()->with('success', $this->crud->tableLabel . ' successfully deleted.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function customData($data)
    {
        $request = $data;
        $data = $data->all();

        if($this->crud->enableFileUploads){
            foreach($request->files as $attribute =>  $file){
                $path = isset($this->crud->uploadSavePath[$attribute]) ? $this->crud->uploadSavePath[$attribute] : 'uploads';
                $data[$attribute] = request()->file($attribute)->store($path,'public');
            }
        }

        $data = collect($data)->map(function($name){
            if(is_array($name)){
                $name = implode(',',$name);
            }

            return (string)$name;
        })->toArray();

        return $data;
    }

    public function customizeData($data)
    {
       return $data;
    }

    public function query() {

    }
}