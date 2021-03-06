package com.springer.patryk.tas_android.fragments;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.TimePicker;
import android.widget.Toast;

import com.springer.patryk.tas_android.MyApp;
import com.springer.patryk.tas_android.R;
import com.springer.patryk.tas_android.SessionManager;
import com.springer.patryk.tas_android.activities.MainActivity;
import com.springer.patryk.tas_android.models.Task;

import org.joda.time.DateTime;
import org.joda.time.LocalDate;
import org.joda.time.LocalTime;
import org.joda.time.format.ISODateTimeFormat;

import butterknife.BindView;
import io.realm.Realm;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * Created by Patryk on 10.12.2016.
 */

public class CreateTaskFragment extends BaseFragment {

    @BindView(R.id.newTaskTitle)
    EditText taskTitle;
    @BindView(R.id.newTaskDescription)
    EditText taskDescription;
    @BindView(R.id.newTaskStartDate)
    DatePicker taskStartDate;
    @BindView(R.id.newTaskStartTime)
    TimePicker taskStartTime;

    @BindView(R.id.createNewTask)
    Button createTask;
    SessionManager sessionManager;
    private SharedPreferences sharedPreferences;
    private boolean isNewTask;
    private Task task;

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        sessionManager = new SessionManager(getContext());
        userDetails = sessionManager.getUserDetails();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View rootView = inflater.inflate(R.layout.new_task_dialog, null);

        sharedPreferences = getContext()
                .getSharedPreferences("DayDetails", Context.MODE_PRIVATE);
        ((MainActivity) getActivity()).hideFabs();


        return rootView;
    }

    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        if (getArguments() != null) {
            isNewTask = false;
            String id = (String) getArguments().getSerializable("Task");
            task = realm.where(Task.class).equalTo("id", id).findFirst();

            setTaskDetails();
        } else {
            isNewTask = true;
            DateTime currentDate;
            if (!sharedPreferences.getString("CurrentDate", "").equals("")) {
                currentDate = ISODateTimeFormat.dateTime().parseDateTime(sharedPreferences.getString("CurrentDate", ""));
            } else {
                currentDate = DateTime.now();
            }
            taskStartDate.updateDate(currentDate.getYear(), currentDate.getMonthOfYear() - 1, currentDate.getDayOfMonth());
            taskStartTime.setCurrentHour(currentDate.getHourOfDay());
            taskStartTime.setCurrentMinute(currentDate.getMinuteOfHour());
        }

        createTask.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (isNewTask)
                    createTask();
                else
                    editTask();
            }
        });

    }

    public void createTask() {
        task = new Task();
        task.setTitle(taskTitle.getText().toString());
        task.setUser(sessionManager.getUserDetails().get("id"));
        task.setDescription(taskDescription.getText().toString());

        DateTime startDateTime = new DateTime(taskStartDate.getYear()
                , (taskStartDate.getMonth() + 1)
                , taskStartDate.getDayOfMonth()
                , taskStartTime.getCurrentHour()
                , taskStartTime.getCurrentMinute()
                , 0
                , 0);
        task.setStartDate(startDateTime.toLocalDate().toString());
        task.setStartTime(startDateTime.toLocalTime().toString());

        Call<Task> call = MyApp.getApiService().createTask(task);
        call.enqueue(new Callback<Task>() {
            @Override
            public void onResponse(Call<Task> call, Response<Task> response) {
                Toast.makeText(getContext(), "Task created", Toast.LENGTH_SHORT).show();
                updateTasks(userDetails.get("id"));
                getFragmentManager().popBackStack();
            }

            @Override
            public void onFailure(Call<Task> call, Throwable t) {

            }
        });
    }

    public void setTaskDetails() {
        taskTitle.setText(task.getTitle());
        taskDescription.setText(task.getDescription());
        LocalDate localDate = LocalDate.parse(task.getStartDate());
        LocalTime localTime = LocalTime.parse(task.getStartTime());
        taskStartDate.updateDate(localDate.getYear(), localDate.getMonthOfYear() - 1, localDate.getDayOfMonth());
        taskStartTime.setCurrentHour(localTime.getHourOfDay());
        taskStartTime.setCurrentMinute(localTime.getMinuteOfHour());
    }

    public void editTask() {
        realm.executeTransaction(new Realm.Transaction() {
            @Override
            public void execute(Realm realm) {
                task.setTitle(taskTitle.getText().toString());
                task.setUser(sessionManager.getUserDetails().get("id"));
                task.setDescription(taskDescription.getText().toString());

                DateTime startDateTime = new DateTime(taskStartDate.getYear()
                        , (taskStartDate.getMonth() + 1)
                        , taskStartDate.getDayOfMonth()
                        , taskStartTime.getCurrentHour()
                        , taskStartTime.getCurrentMinute()
                        , 0
                        , 0);

                task.setStartDate(startDateTime.toLocalDate().toString());
                task.setStartTime(startDateTime.toLocalTime().toString());
            }
        });
        Task taskToUpdate = realm.copyFromRealm(task);
        Call<Void> call = MyApp.getApiService().editTask(taskToUpdate.getId(), taskToUpdate);
        call.enqueue(new Callback<Void>() {
            @Override
            public void onResponse(Call<Void> call, Response<Void> response) {
                Toast.makeText(getContext(), "Task updated", Toast.LENGTH_SHORT).show();
                getFragmentManager().popBackStack();
            }

            @Override
            public void onFailure(Call<Void> call, Throwable t) {

            }
        });
    }

    @Override
    public void onDestroyView() {
        ((MainActivity) getActivity()).showMainFab();
        super.onDestroyView();
    }
}
