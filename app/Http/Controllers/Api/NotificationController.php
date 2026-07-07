<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // Liste des notifications de l'utilisateur connecté
    public function index(Request $request)
    {
        $notifications = Notification::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($notifications);
    }

    // Marquer une notification comme lue
    public function markAsRead($id)
    {
        $notification = Notification::where('user_id', auth()->id())
            ->where('id', $id)
            ->firstOrFail();

        $notification->lue = true;
        $notification->save();

        return response()->json($notification);
    }

    // Compter les notifications non lues
    public function unreadCount(Request $request)
    {
        $count = Notification::where('user_id', $request->user()->id)
            ->where('lue', false)
            ->count();

        return response()->json(['unread_count' => $count]);
    }
}