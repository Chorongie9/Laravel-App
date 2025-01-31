<?php

namespace App\Http\Controllers;
use App\Models\Ads;

use Illuminate\Http\Request;

class AdController extends Controller
{
    public function index(){
        $ads = Ads::all();
        return response()->json($ads);
    }

    public function create(Request $request)
    {
        $path = null;

        if ($request->hasFile('image')){
            $path = $request->file('image') -> store('image', 'public');
        }

        $validatedData = $request->validate([
            'title' => ['required', 'min:3'],
            'description' => ['required'],
            'image' => ['required']
        ]);

        $ad = new Ads();
        $ad->title = $request->title;
        $ad->description = $request->description;
        $ad->image = $path;
        $ad->save();

        return response()->json(['message' => 'Ad created']);
    }

    public function show($id){
        $ads = Ads::find($id);

        if (!$ads){
            return response()->json(['message' => 'Ad not found'], 404);
        }

        return response()->json($ads);
    }

    public function update(Request $request, $id){
        $ad = Ads::find($id);
        $ad->title = request('title');
        $ad->description = request('description');
        $ad->save();
        return response()->json(['message' => 'Ad updated successfully']);
    }
    



    public function destroy($id){ 

        $ads = Ads::find($id);
        $ads->delete();
        return response()->json(['message' => 'Ad deleted successfully.']);

    }
}
