<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            Notification::where('user_id', $request->user()->id)
                ->latest()
                ->paginate(10)
        );
    }

    public function markAsRead(Request $request, Notification $notification): JsonResponse
    {
        if ($notification->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Accès interdit.'], 403);
        }

        $notification->update(['lue' => true]);

        return response()->json([
            'message' => 'Notification marquée comme lue.',
            'data' => $notification,
        ]);
    }

    public function unreadCount(Request $request): JsonResponse
    {
        return response()->json([
            'unread_count' => Notification::where('user_id', $request->user()->id)
                ->where('lue', false)
                ->count(),
        ]);
    }
}
