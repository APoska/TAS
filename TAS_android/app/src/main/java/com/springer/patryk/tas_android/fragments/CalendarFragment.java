package com.springer.patryk.tas_android.fragments;

import android.content.Context;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.design.widget.FloatingActionButton;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;

import android.widget.GridView;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.springer.patryk.tas_android.MyApp;
import com.springer.patryk.tas_android.R;
import com.springer.patryk.tas_android.SessionManager;
import com.springer.patryk.tas_android.adapters.CalendarDayOfMonthAdapter;
import com.springer.patryk.tas_android.adapters.CalendarGridAdapter;
import com.springer.patryk.tas_android.models.Date;
import com.springer.patryk.tas_android.models.Task;

import net.danlew.android.joda.DateUtils;

import org.joda.time.DateTime;

import java.util.HashMap;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * Created by Patryk on 23.11.2016.
 */

public class CalendarFragment extends Fragment {

    private Context mContext;
    private static final String LOG_TAG = CalendarFragment.class.getSimpleName();


    @BindView(R.id.backArrow)
    ImageView backArrow;
    @BindView(R.id.nextArrow)
    ImageView nextArrow;
    @BindView(R.id.monthText)
    TextView currentMonth;
    @BindView(R.id.monthView)
    GridView monthView;
    @BindView(R.id.daysTitle)
    GridView dayTitles;

    SessionManager sessionManager;

    private DateTime dateNow;
    private CalendarGridAdapter calendarGridAdapter;

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.calendar_fragment, container, false);
        mContext = getContext();
        ButterKnife.bind(this, rootView);
        sessionManager = new SessionManager(mContext);
        dateNow = DateTime.now();


        dayTitles.setAdapter(new CalendarDayOfMonthAdapter(mContext, getResources().getStringArray(R.array.day_names)));

        calendarGridAdapter = new CalendarGridAdapter(mContext, dateNow);
        monthView.setAdapter(calendarGridAdapter);

        monthView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Date date = (Date) calendarGridAdapter.getItem(position);
                Toast.makeText(mContext, String.valueOf(date.getDayOfWeek()), Toast.LENGTH_SHORT).show();
            }
        });
        backArrow.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setPreviousMonth();
                updateDate();
            }
        });
        nextArrow.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setNextMonth();
                updateDate();
            }
        });


        updateDate();
        getTask();
        return rootView;
    }

    public void updateDate() {
        currentMonth.setText(DateUtils.formatDateTime(mContext, dateNow, DateUtils.FORMAT_SHOW_YEAR | DateUtils.FORMAT_NO_MONTH_DAY));
        calendarGridAdapter.setCurrentMonth(dateNow);
    }

    public void setPreviousMonth() {
        dateNow = dateNow.minusMonths(1);
        updateDate();
    }

    public void setNextMonth() {
        dateNow = dateNow.plusMonths(1);
        updateDate();
    }

    public void getTask() {
        HashMap<String, String> userDetails = sessionManager.getUserDetails();
        Call<List<Task>> call = MyApp.getApiService().getTasks(userDetails.get("id"));
        call.enqueue(new Callback<List<Task>>() {
            @Override
            public void onResponse(Call<List<Task>> call, Response<List<Task>> response) {
               calendarGridAdapter.setTasks(response.body());
            }

            @Override
            public void onFailure(Call<List<Task>> call, Throwable t) {

            }
        });
    }

    public void parseData(List<Task> tasks) {

    }
}