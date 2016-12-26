package com.springer.patryk.tas_android.adapters;

import android.content.Context;
import android.os.Bundle;
import android.support.v4.app.FragmentManager;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.springer.patryk.tas_android.R;
import com.springer.patryk.tas_android.fragments.DayDetailsFragment;
import com.springer.patryk.tas_android.models.Date;
import com.springer.patryk.tas_android.models.Task;

import org.joda.time.DateTime;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Patryk on 25.11.2016.
 */

public class CalendarGridAdapter extends RecyclerView.Adapter<CalendarGridAdapter.ViewHolder> {

    private static final int TYPE_HEADER = 0;
    private static final int TYPE_REGULAR = 1;
    private Date currentDay;
    private List<Date> daysOfMonth;
    private List<Task> tasks;
    private Context mContext;
    private FragmentManager manager;

    public CalendarGridAdapter(Context context, DateTime currentMonth) {
        tasks = new ArrayList<>();
        this.mContext = context;
        this.currentDay = new Date(
                currentMonth.getDayOfMonth()
                , currentMonth.getDayOfWeek()
                , currentMonth.getMonthOfYear()
                , currentMonth.getYear()
                , "");
        manager = ((AppCompatActivity) mContext).getSupportFragmentManager();
        setMonthToShow(currentMonth);
    }

    @Override
    public int getItemViewType(int position) {
        if (position == 0)
            return TYPE_HEADER;
        else
            return TYPE_REGULAR;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(parent.getContext()).inflate(R.layout.day_item, parent, false);
        return new ViewHolder(itemView);
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        Date date = daysOfMonth.get(position);
        if (date == null) {
            holder.day.setVisibility(View.INVISIBLE);
        } else {
            holder.dayNumber.setText(String.valueOf(date.getDayOfMonth()));
            holder.day.setVisibility(View.VISIBLE);
            if (searchHasTask(position)) {
                holder.dayTask.setVisibility(View.VISIBLE);
                holder.dayTask.setText(String.valueOf(date.getTasks().size()));

            } else {
                holder.dayTask.setVisibility(View.INVISIBLE);
                holder.dayMeeting.setVisibility(View.INVISIBLE);
            }
            if (date.equals(currentDay)) {
                holder.day.setBackgroundResource(R.drawable.today_background);
            } else {
                holder.day.setBackgroundResource(0);
            }
        }

    }

    public List<Task> getTasks(int position) {
        return daysOfMonth.get(position).getTasks();
    }

    @Override
    public long getItemId(int position) {
        return 0;
    }

    @Override
    public int getItemCount() {
        return daysOfMonth.size();
    }


    public class ViewHolder extends RecyclerView.ViewHolder {
        TextView dayNumber;
        TextView dayTask;
        TextView dayMeeting;
        LinearLayout day;

        public ViewHolder(View itemView) {
            super(itemView);
            dayNumber = (TextView) itemView.findViewById(R.id.dayTitle);
            dayTask = (TextView) itemView.findViewById(R.id.dayTask);
            dayMeeting = (TextView) itemView.findViewById(R.id.dayMeeting);
            day = (LinearLayout) itemView.findViewById(R.id.dayItem);

            itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    List<Task> tasks = getTasks(getAdapterPosition());
                    if (tasks.size() > 0) {
                        Bundle bundle = new Bundle();
                        bundle.putSerializable("tasks", (Serializable) tasks);
                        DayDetailsFragment fragment = new DayDetailsFragment();
                        fragment.setArguments(bundle);
                        manager
                                .beginTransaction()
                                .replace(R.id.mainContent, fragment, null)
                                .addToBackStack(null)
                                .commit();
                    } else
                        Toast.makeText(mContext, "No task at this day", Toast.LENGTH_SHORT).show();

                }
            });
        }
    }


    public void setMonthToShow(DateTime monthToShow) {
        daysOfMonth = convertToList(monthToShow);
        notifyDataSetChanged();
    }

    private List<Date> convertToList(DateTime monthToShow) {
        List<Date> month = new ArrayList<>();

        int firstDayOfDisplayedMonth = monthToShow.withDayOfMonth(1).getDayOfWeek() % 7;
        int emptyPosition = 0;

        while (emptyPosition < firstDayOfDisplayedMonth) {
            month.add(null);
            emptyPosition++;
        }

        int daysCountInMonth = monthToShow.dayOfMonth().getMaximumValue();

        monthToShow = monthToShow
                .dayOfMonth()
                .withMinimumValue();

        for (int i = 0; i < daysCountInMonth; i++) {
            month.add(new Date
                    (monthToShow.getDayOfMonth()
                            , monthToShow.getDayOfWeek()
                            , monthToShow.getMonthOfYear()
                            , monthToShow.getYear()
                            , "")
            );
            monthToShow = monthToShow.plusDays(1);
        }
        return month;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
        notifyDataSetChanged();
    }


    public boolean searchHasTask(int position) {
        Date dayAtPosition = daysOfMonth.get(position);
        DateTime current = new DateTime(dayAtPosition.getYear(), dayAtPosition.getMonth(), dayAtPosition.getDayOfMonth(), 0, 0);
        List<Task> tasksOfDay = new ArrayList<>();
        for (Task task : tasks) {
            DateTime date = new DateTime(task.getStartDate());

            if (current.toLocalDate().equals(date.toLocalDate())) {
                tasksOfDay.add(task);
            }
        }
        daysOfMonth.get(position).setTask(tasksOfDay);
        return tasksOfDay.size() > 0;
    }
}
