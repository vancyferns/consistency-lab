from datetime import date, timedelta, datetime

def calculate_completion_date(
    total_duration_minutes: int,
    study_days: list,  # [0, 2, 4] for Mon, Wed, Fri
    hours_per_day: float,
    start_date: date
) -> tuple:
    """
    Calculate course completion date based on study schedule
    
    Args:
        total_duration_minutes: Total course duration in minutes
        study_days: List of weekday numbers (0=Mon, 6=Sun)
        hours_per_day: Study hours per session
        start_date: Starting date
    
    Returns:
        (completion_date, total_days, study_sessions)
    """
    minutes_per_session = hours_per_day * 60
    total_sessions_needed = total_duration_minutes / minutes_per_session if minutes_per_session > 0 else 0
    
    current_date = start_date
    sessions_completed = 0
    days_elapsed = 0
    
    while sessions_completed < total_sessions_needed:
        # Check if current day is a study day
        if current_date.weekday() in study_days:
            sessions_completed += 1
        
        current_date += timedelta(days=1)
        days_elapsed += 1
        
        # Safety check (max 1 year)
        if days_elapsed > 365:
            break
    
    completion_date = current_date - timedelta(days=1)  # Go back one day
    study_sessions = int(total_sessions_needed)
    
    return completion_date, days_elapsed, study_sessions

def generate_study_schedule(
    study_days: list,
    hours_per_day: float,
    start_date: date,
    end_date: date
) -> list:
    """
    Generate detailed study calendar
    """
    schedule = []
    current_date = start_date
    weekday_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    
    while current_date <= end_date:
        if current_date.weekday() in study_days:
            schedule.append({
                'date': current_date.isoformat(),
                'day': weekday_names[current_date.weekday()],
                'duration_minutes': int(hours_per_day * 60),
                'is_study_day': True
            })
        current_date += timedelta(days=1)
    
    return schedule

def distribute_videos_to_schedule(
    videos: list,
    study_days: list,
    daily_minutes: int,
    start_date: date
) -> list:
    """
    Distribute videos across study days respecting the daily time limit.
    
    Args:
        videos: List of video dicts with 'duration_seconds' or 'duration_minutes'
        study_days: List of weekday numbers (0-6)
        daily_minutes: Max minutes per day
        start_date: Start date object
        
    Returns:
        List of day objects with assigned videos:
        [
            {
                'date': '2024-01-01',
                'day': 'Monday',
                'videos': [video1, video2],
                'total_minutes': 45
            }, 
            ...
        ]
    """
    schedule = []
    weekday_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    
    current_date = start_date
    current_day_videos = []
    current_day_minutes = 0
    
    # Ensure current_date is a valid study day
    while current_date.weekday() not in study_days:
        current_date += timedelta(days=1)
        
    for video in videos:
        # Get duration in minutes
        duration = video.get('duration_minutes', 0)
        if 'duration_seconds' in video:
            duration = video['duration_seconds'] / 60
            
        # Check if adding this video exceeds the daily limit
        # Allow at least one video per day even if it exceeds limit slightly
        if current_day_minutes + duration > daily_minutes and current_day_videos:
            # Finalize current day
            schedule.append({
                'date': current_date.isoformat(),
                'day': weekday_names[current_date.weekday()],
                'videos': current_day_videos,
                'total_minutes': round(current_day_minutes)
            })
            
            # Move to next valid study day
            current_date += timedelta(days=1)
            while current_date.weekday() not in study_days:
                current_date += timedelta(days=1)
                
            # Reset for new day
            current_day_videos = []
            current_day_minutes = 0
            
        # Add video to current day
        current_day_videos.append(video)
        current_day_minutes += duration
        
    # Append the last day if it has videos
    if current_day_videos:
        schedule.append({
            'date': current_date.isoformat(),
            'day': weekday_names[current_date.weekday()],
            'videos': current_day_videos,
            'total_minutes': round(current_day_minutes)
        })
        
    return schedule
